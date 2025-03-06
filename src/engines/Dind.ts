/**
 * Docker in docker engine
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Array from "effect/Array";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Number from "effect/Number";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as Tuple from "effect/Tuple";
import * as TarCommon from "eftar/Common";
import * as Tar from "eftar/Tar";
import * as Untar from "eftar/Untar";
import * as DockerEngine from "./Docker.js";

import { RecommendedDindBaseImages } from "../blobs/Constants.js";
import { content as HttpBlob } from "../blobs/Http.js";
import { content as HttpsBlob } from "../blobs/Https.js";
import { content as SocketBlob } from "../blobs/Socket.js";
import { content as SshBlob } from "../blobs/Ssh.js";
import { waitForProgressToComplete } from "../convey/Sinks.js";
import { Containers, ContainersError } from "../endpoints/Containers.js";
import { ImagesError } from "../endpoints/Images.js";
import { SystemsError } from "../endpoints/System.js";
import { Volumes, VolumesError } from "../endpoints/Volumes.js";
import {
    HttpConnectionOptions,
    HttpsConnectionOptions,
    MobyConnectionOptions,
    SocketConnectionOptions,
    SshConnectionOptions,
} from "../MobyConnection.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type MakeDindLayerFromPlatformConstructor<
    PlatformLayerConstructor extends (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connectionOptions: any
    ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
    SupportedConnectionOptions extends MobyConnectionOptions = PlatformLayerConstructor extends (
        connectionOptions: infer C
    ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
        ? C
        : never,
    PlatformLayerConstructorError = ReturnType<PlatformLayerConstructor> extends Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        infer E,
        infer _R
    >
        ? E
        : never,
    PlatformLayerConstructorContext = ReturnType<PlatformLayerConstructor> extends Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        infer _E,
        infer R
    >
        ? R
        : never,
> = <
    ConnectionOptionsToHost extends SupportedConnectionOptions,
    ConnectionOptionsToDind extends SupportedConnectionOptions["_tag"],
>(options: {
    exposeDindContainerBy: ConnectionOptionsToDind;
    connectionOptionsToHost: ConnectionOptionsToHost;
    dindBaseImage: RecommendedDindBaseImages;
}) => Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    | ImagesError
    | SystemsError
    | VolumesError
    | ParseResult.ParseError
    | ContainersError
    | PlatformLayerConstructorError
    | (ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never),
    | PlatformLayerConstructorContext
    | (ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never)
>;

/**
 * @since 1.0.0
 * @category Helpers
 * @internal
 */
const downloadDindCertificates = (
    dindContainerId: string
): Effect.Effect<
    {
        ca: string;
        key: string;
        cert: string;
    },
    ContainersError | ParseResult.ParseError,
    Containers
> =>
    Effect.gen(function* () {
        const containers = yield* Containers;
        const certs = yield* Untar.Untar(containers.archive(dindContainerId, { path: "/certs" }));

        const readAndAssemble = (
            path: string
        ): (<E, R>(
            data: HashMap.HashMap<
                Schema.Schema.Type<(typeof TarCommon.TarHeader)["non-full"]>,
                Stream.Stream<Uint8Array, E, R>
            >
        ) => Effect.Effect<string, E, R>) =>
            Function.flow(
                HashMap.findFirst((_stream, header) => header.filename === path),
                Option.getOrThrow,
                Tuple.getSecond,
                Stream.decodeText(),
                Stream.mkString
            );

        return yield* Effect.all(
            {
                ca: readAndAssemble("certs/server/ca.pem")(certs),
                key: readAndAssemble("certs/server/key.pem")(certs),
                cert: readAndAssemble("certs/server/cert.pem")(certs),
            },
            { concurrency: 3 }
        );
    });

/**
 * @since 1.0.0
 * @category Helpers
 * @internal
 */
const blobForExposeBy: (exposeDindContainerBy: MobyConnectionOptions["_tag"]) => string = Function.pipe(
    Match.type<MobyConnectionOptions["_tag"]>(),
    Match.when("ssh", () => SshBlob),
    Match.when("http", () => HttpBlob),
    Match.when("https", () => HttpsBlob),
    Match.when("socket", () => SocketBlob),
    Match.exhaustive
);

/**
 * @since 1.0.0
 * @category Helpers
 * @internal
 */
const makeDindBinds = <ExposeDindBy extends MobyConnectionOptions["_tag"]>(
    exposeDindBy: ExposeDindBy
): Effect.Effect<
    readonly [boundDockerSocket: string, binds: Array<string>],
    VolumesError | (ExposeDindBy extends "socket" ? PlatformError.PlatformError : never),
    Volumes | Scope.Scope | (ExposeDindBy extends "socket" ? Path.Path | FileSystem.FileSystem : never)
> =>
    Effect.gen(function* () {
        const acquireScopedVolume = Effect.acquireRelease(
            Volumes.use((volumes) => volumes.create({})),
            ({ Name }) => Effect.orDie(Volumes.use((volumes) => volumes.delete(Name)))
        );

        const volume1 = yield* acquireScopedVolume;
        const volume2 = yield* acquireScopedVolume;

        const tempSocketDirectory = yield* Effect.if(exposeDindBy === "socket", {
            onFalse: () => Effect.succeed(""),
            onTrue: () =>
                Effect.flatMap(FileSystem.FileSystem, (fs) =>
                    Effect.gen(function* () {
                        const tempDirectory = yield* fs.makeTempDirectoryScoped();
                        yield* fs.chown(tempDirectory, 1000, 1000);
                        yield* fs.chmod(tempDirectory, 0o777);
                        return tempDirectory;
                    })
                ),
        });

        const boundDockerSocket = yield* Effect.if(exposeDindBy === "socket", {
            onFalse: () => Effect.succeed(""),
            onTrue: () => Effect.map(Path.Path, (path) => path.join(tempSocketDirectory, "docker.sock")),
        });

        const mountBinds = exposeDindBy === "socket" ? [`${tempSocketDirectory}:/run/user/1000`] : [];
        const volumeBinds = Tuple.make(
            `${volume1.Name}:/var/lib/docker`,
            `${volume2.Name}:/home/rootless/.local/share/docker`
        );
        const binds = Array.appendAll(mountBinds, volumeBinds);
        return [boundDockerSocket, binds] as const;
    }) as Effect.Effect<
        readonly [boundDockerSocket: string, binds: Array<string>],
        VolumesError | (ExposeDindBy extends "socket" ? PlatformError.PlatformError : never),
        Volumes | Scope.Scope | (ExposeDindBy extends "socket" ? Path.Path | FileSystem.FileSystem : never)
    >;

/**
 * Since the dind containers do not have health checks, we must wait until a
 * specific log line is printed to know that the engine is ready.
 *
 * @since 1.0.0
 * @category Helpers
 * @internal
 */
const waitForDindContainerToBeReady = (dindContainerId: string): Effect.Effect<void, ContainersError, Containers> =>
    Function.pipe(
        Containers.use((containers) =>
            containers.logs(dindContainerId, {
                follow: true,
                stdout: true,
                stderr: true,
            })
        ),
        Stream.unwrap,
        Stream.takeUntil(String.includes("Daemon has completed initialization")),
        Stream.runDrain
    );

/**
 * Spawns a docker in docker container on the remote host provided by another
 * layer and exposes the dind container as a layer. This dind engine was built
 * to power the unit tests.
 *
 * @since 1.0.0
 * @category Engines
 */
export const makeDindLayerFromPlatformConstructor =
    <
        PlatformLayerConstructor extends (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            connectionOptions: any
        ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
        SupportedConnectionOptions extends MobyConnectionOptions = PlatformLayerConstructor extends (
            connectionOptions: infer C
        ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
            ? C
            : never,
    >(
        platformLayerConstructor: PlatformLayerConstructor
    ): MakeDindLayerFromPlatformConstructor<PlatformLayerConstructor> =>
    <
        ConnectionOptionsToHost extends SupportedConnectionOptions,
        ConnectionOptionsToDind extends SupportedConnectionOptions["_tag"],
        PlatformLayerConstructorError = ReturnType<PlatformLayerConstructor> extends Layer.Layer<
            Layer.Layer.Success<DockerEngine.DockerLayer>,
            infer E,
            infer _R
        >
            ? E
            : never,
        PlatformLayerConstructorContext = ReturnType<PlatformLayerConstructor> extends Layer.Layer<
            Layer.Layer.Success<DockerEngine.DockerLayer>,
            infer _E,
            infer R
        >
            ? R
            : never,
    >(options: {
        exposeDindContainerBy: ConnectionOptionsToDind;
        connectionOptionsToHost: ConnectionOptionsToHost;
        dindBaseImage: RecommendedDindBaseImages;
    }): Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        | ImagesError
        | SystemsError
        | VolumesError
        | ParseResult.ParseError
        | ContainersError
        | PlatformLayerConstructorError
        | (ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never),
        | PlatformLayerConstructorContext
        | (ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never)
    > =>
        Effect.gen(function* () {
            // The generic type of the layer constructor is too wide
            // since we want to be able to pass it as the only required generic
            const platformLayerConstructorCasted = platformLayerConstructor as (
                connectionOptions: SupportedConnectionOptions
            ) => Layer.Layer<
                Layer.Layer.Success<DockerEngine.DockerLayer>,
                PlatformLayerConstructorError,
                PlatformLayerConstructorContext
            >;

            // Building a layer here instead of providing it to the final effect
            // prevents conflicting services with the same tag in the final layer
            const hostDocker = yield* Layer.build(platformLayerConstructorCasted(options.connectionOptionsToHost));
            const effectWithHostDocker = Effect.provide(hostDocker);
            const streamWithHostDocker = Stream.provideContext(hostDocker);

            // Test that the host docker is reachable
            yield* Function.pipe(
                DockerEngine.pingHead(),
                Effect.retry(Schedule.recurs(5).pipe(Schedule.addDelay(() => "3 seconds"))),
                effectWithHostDocker
            );

            // Build the docker image for the dind container
            const dindTag = Array.lastNonEmpty(String.split(options.dindBaseImage, ":"));
            const dindBlob = blobForExposeBy(options.exposeDindContainerBy);
            const buildStream = streamWithHostDocker(
                DockerEngine.build({
                    dockerfile: "Dockerfile",
                    buildArgs: { DIND_BASE_IMAGE: options.dindBaseImage },
                    tag: `the-moby-effect-${options.exposeDindContainerBy}-${dindTag}:latest`,
                    context: Tar.tarballFromMemory(HashMap.make(["Dockerfile", dindBlob] as const)),
                })
            );

            // Wait for the image to be built
            yield* waitForProgressToComplete(buildStream);

            // Create volumes and binds for the container so they can be cleaned up after
            const [boundDockerSocket, binds] = yield* effectWithHostDocker(
                makeDindBinds(options.exposeDindContainerBy)
            );

            // Create the dind container
            const containerInspectResponse = yield* effectWithHostDocker(
                DockerEngine.runScoped({
                    spec: {
                        Image: `the-moby-effect-${options.exposeDindContainerBy}-${dindTag}:latest`,
                        Volumes: { "/var/lib/docker": {}, "/home/rootless/.local/share/docker": {} },
                        ExposedPorts: {
                            "22/tcp": {},
                            "2375/tcp": {},
                            "2376/tcp": {},
                        },
                        HostConfig: {
                            Privileged: true,
                            Binds: binds,
                            PortBindings: {
                                "22/tcp": [{ HostPort: "0" }],
                                "2375/tcp": [{ HostPort: "0" }],
                                "2376/tcp": [{ HostPort: "0" }],
                            },
                        },
                    },
                })
            );

            // Extract the ports from the container inspect response
            const tryGetPort = Function.flow(
                Option.fromNullable<string | undefined>,
                Option.flatMap(Number.parse),
                Option.getOrThrow
            );
            const sshPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["22/tcp"]?.[0]?.HostPort);
            const httpPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort);
            const httpsPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2376/tcp"]?.[0]?.HostPort);

            // Get the host from the connection options
            const host = Function.pipe(
                Match.value<MobyConnectionOptions>(options.connectionOptionsToHost),
                Match.tag("socket", () => "localhost" as const),
                Match.orElse(({ host }) => host)
            );

            // Wait for the dind container to be ready
            yield* effectWithHostDocker(waitForDindContainerToBeReady(containerInspectResponse.Id));

            // Get the engine certificates if we are exposing the dind container by https
            const { ca, cert, key } = yield* Effect.if(options.exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed({ ca: "", cert: "", key: "" } as const),
                onTrue: () => effectWithHostDocker(downloadDindCertificates(containerInspectResponse.Id)),
            });

            // Craft the connection options
            const connectionOptions = Function.pipe(
                Match.value<MobyConnectionOptions["_tag"]>(options.exposeDindContainerBy),
                Match.when("http", () => HttpConnectionOptions({ host, port: httpPort })),
                Match.when("https", () => HttpsConnectionOptions({ host, port: httpsPort, ca, key, cert })),
                Match.when("socket", () => SocketConnectionOptions({ socketPath: boundDockerSocket })),
                Match.when("ssh", () =>
                    SshConnectionOptions({
                        host,
                        port: sshPort,
                        username: "root",
                        password: "password",
                        remoteSocketPath: "/var/run/docker.sock",
                    })
                ),
                Match.exhaustive
            ) as SupportedConnectionOptions;

            // Build the layer for the same platform that we are on
            const layer = platformLayerConstructorCasted(connectionOptions);

            // Test that the dind container is reachable
            yield* Function.pipe(
                DockerEngine.pingHead(),
                Effect.retry(Schedule.recurs(5).pipe(Schedule.addDelay(() => "3 seconds"))),
                Effect.provide(layer)
            );

            return layer;
        }).pipe(Layer.unwrapScoped);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerNodeJS> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerNodeJS);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerBun> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerBun);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerDeno> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerDeno);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerUndici> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerUndici);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerWeb> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerWeb);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerFetch> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerFetch);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerAgnostic> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerAgnostic);
