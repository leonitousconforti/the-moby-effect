import type * as PlatformError from "@effect/platform/Error";
import type * as ParseResult from "effect/ParseResult";
import type * as Schema from "effect/Schema";
import type * as Scope from "effect/Scope";
import type * as TarHeader from "eftar/Header";
import type * as DindEngine from "../../DindEngine.js";
import type * as BlobConstants from "../blobs/constants.js";
import type * as IdSchemas from "../schemas/id.js";

import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as InternetSchemas from "effect-schemas/Internet";
import * as Array from "effect/Array";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as HashSet from "effect/HashSet";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as Schedule from "effect/Schedule";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as Tuple from "effect/Tuple";
import * as Tar from "eftar/Tar";
import * as Untar from "eftar/Untar";
import * as DockerEngine from "../../DockerEngine.js";
import * as MobyConnection from "../../MobyConnection.js";
import * as MobyConvey from "../../MobyConvey.js";
import * as MobyEndpoints from "../../MobyEndpoints.js";
import * as internalHttpBlob from "../blobs/http.js";
import * as internalHttpsBlob from "../blobs/https.js";
import * as internalSocketBlob from "../blobs/socket.js";
import * as internalSshBlob from "../blobs/ssh.js";

/** @internal */
const downloadDindCertificates = (
    dindContainerId: IdSchemas.ContainerIdentifier
): Effect.Effect<
    {
        ca: string;
        key: string;
        cert: string;
    },
    DockerEngine.DockerError | ParseResult.ParseError,
    MobyEndpoints.Containers
> =>
    Effect.gen(function* () {
        const containers = yield* MobyEndpoints.Containers;
        const certs = yield* Effect.catchTag(
            Untar.extractEntries(
                containers.archive(dindContainerId, { path: "/certs" }),
                HashSet.make("certs/server/ca.pem", "certs/server/key.pem", "certs/server/cert.pem")
            ),
            "MissingEntries",
            () => Effect.dieMessage("Missing dind certificates in container")
        );

        const readAndAssemble = (
            path: string
        ): (<E, R>(
            data: HashMap.HashMap<
                Schema.Schema.Type<(typeof TarHeader.TarHeader)["non-full"]>,
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

/** @internal */
const blobForExposeBy: (exposeDindContainerBy: MobyConnection.MobyConnectionOptions["_tag"]) => string = Function.pipe(
    Match.type<MobyConnection.MobyConnectionOptions["_tag"]>(),
    Match.when("ssh", () => internalSshBlob.content),
    Match.when("http", () => internalHttpBlob.content),
    Match.when("https", () => internalHttpsBlob.content),
    Match.when("socket", () => internalSocketBlob.content),
    Match.exhaustive
);

/** @internal */
const makeDindBinds = <ExposeDindBy extends MobyConnection.MobyConnectionOptions["_tag"]>(
    exposeDindBy: ExposeDindBy
): Effect.Effect<
    readonly [boundDockerSocket: string, binds: Array<string>],
    DockerEngine.DockerError | (ExposeDindBy extends "socket" ? PlatformError.PlatformError : never),
    MobyEndpoints.Volumes | Scope.Scope | (ExposeDindBy extends "socket" ? Path.Path | FileSystem.FileSystem : never)
> =>
    Effect.gen(function* () {
        const acquireScopedVolume = Effect.acquireRelease(
            MobyEndpoints.Volumes.use((volumes) => volumes.create({})),
            ({ Name }) => Effect.orDie(MobyEndpoints.Volumes.use((volumes) => volumes.delete(Name)))
        );

        const volume1 = yield* acquireScopedVolume;
        const volume2 = yield* acquireScopedVolume;

        const tempSocketDirectory = yield* Effect.if(exposeDindBy === "socket", {
            onFalse: () => Effect.succeed(""),
            onTrue: () => Effect.flatMap(FileSystem.FileSystem, (fs) => fs.makeTempDirectoryScoped()),
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
        DockerEngine.DockerError | (ExposeDindBy extends "socket" ? PlatformError.PlatformError : never),
        | MobyEndpoints.Volumes
        | Scope.Scope
        | (ExposeDindBy extends "socket" ? Path.Path | FileSystem.FileSystem : never)
    >;

/**
 * Since the dind containers do not have health checks, we must wait until a
 * specific log line is printed to know that the engine is ready.
 *
 * @internal
 */
const waitForDindContainerToBeReady = (
    dindContainerId: IdSchemas.ContainerIdentifier
): Effect.Effect<void, DockerEngine.DockerError, MobyEndpoints.Containers> =>
    Function.pipe(
        MobyEndpoints.Containers.use((containers) =>
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
 * to power the unit tests and used for docker compose.
 *
 * @internal
 */
export const makeDindLayerFromPlatformConstructor =
    <
        PlatformLayerConstructor extends (
            connectionOptions: any
        ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
        SupportedConnectionOptions extends MobyConnection.MobyConnectionOptions = PlatformLayerConstructor extends (
            connectionOptions: infer C
        ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
            ? C
            : never,
    >(
        platformLayerConstructor: PlatformLayerConstructor
    ): DindEngine.MakeDindLayerFromPlatformConstructor<PlatformLayerConstructor> =>
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
        dindBaseImage: BlobConstants.RecommendedDindBaseImages;
    }): Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        | DockerEngine.DockerError
        | ParseResult.ParseError
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
                    buildargs: { DIND_BASE_IMAGE: options.dindBaseImage },
                    tag: `the-moby-effect-${options.exposeDindContainerBy}-${dindTag}:latest`,
                    context: Tar.tarballFromMemory(HashMap.make(["Dockerfile", dindBlob] as const)),
                })
            );

            // Wait for the image to be built
            yield* MobyConvey.waitForProgressToComplete(buildStream);

            // Create volumes and binds for the container so they can be cleaned up after
            const [boundDockerSocket, binds] = yield* effectWithHostDocker(
                makeDindBinds(options.exposeDindContainerBy)
            );

            // Create the dind container
            const containerInspectResponse = yield* effectWithHostDocker(
                DockerEngine.runScoped({
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
                            "22/tcp": [{ HostPort: InternetSchemas.Port.make(0) }],
                            "2375/tcp": [{ HostPort: InternetSchemas.Port.make(0) }],
                            "2376/tcp": [{ HostPort: InternetSchemas.Port.make(0) }],
                        },
                    },
                })
            );

            // Extract the ports from the container inspect response
            const tryGetPort = Function.flow(Option.fromNullable<number | undefined>, Option.getOrThrow);
            const sshPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["22/tcp"]?.[0]?.HostPort);
            const httpPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort);
            const httpsPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2376/tcp"]?.[0]?.HostPort);

            // Get the host from the connection options
            const host = Function.pipe(
                Match.value<MobyConnection.MobyConnectionOptions>(options.connectionOptionsToHost),
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
                Match.value<MobyConnection.MobyConnectionOptions["_tag"]>(options.exposeDindContainerBy),
                Match.when("socket", () =>
                    MobyConnection.SocketConnectionOptions({
                        socketPath: boundDockerSocket,
                    })
                ),
                Match.when("http", () =>
                    MobyConnection.HttpConnectionOptions({
                        host,
                        port: httpPort,
                    })
                ),
                Match.when("https", () =>
                    MobyConnection.HttpsConnectionOptions({
                        host,
                        port: httpsPort,
                        ca,
                        key,
                        cert,
                    })
                ),
                Match.when("ssh", () =>
                    MobyConnection.SshConnectionOptions({
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
