/**
 * Docker in docker engine
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Array from "effect/Array";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Number from "effect/Number";
import * as Option from "effect/Option";
import * as Record from "effect/Record";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as Tuple from "effect/Tuple";

import * as TarCommon from "../archive/Common.js";
import * as Untar from "../archive/Untar.js";
import * as BlobConstants from "../blobs/Constants.js";
import * as HttpBlob from "../blobs/Http.js";
import * as HttpsBlob from "../blobs/Https.js";
import * as SocketBlob from "../blobs/Socket.js";
import * as SshBlob from "../blobs/Ssh.js";
import * as Convey from "../Convey.js";
import * as Containers from "../endpoints/Containers.js";
import * as Images from "../endpoints/Images.js";
import * as System from "../endpoints/System.js";
import * as Volumes from "../endpoints/Volumes.js";
import * as Platforms from "../Platforms.js";
import * as DockerEngine from "./Docker.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type MakeDindLayerFromPlatformConstructor<
    PlatformLayerConstructor extends (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connectionOptions: any
    ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
    SupportedConnectionOptions extends Platforms.MobyConnectionOptions = PlatformLayerConstructor extends (
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
    dindBaseImage: BlobConstants.RecommendedDindBaseImages;
}) => Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    | Images.ImagesError
    | System.SystemsError
    | Volumes.VolumesError
    | ParseResult.ParseError
    | Containers.ContainersError
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
    Containers.ContainersError | ParseResult.ParseError,
    Containers.Containers
> =>
    Effect.gen(function* () {
        const certs = yield* Function.pipe(
            Containers.Containers.archive({ id: dindContainerId, path: "/certs" }),
            Effect.flatMap(Untar.Untar)
        );

        const readAndAssemble: <E, R>(
            _: Option.Option<[TarCommon.TarHeader, Stream.Stream<Uint8Array, E, R>]>
        ) => Effect.Effect<string, E, R> = Function.flow(
            Option.getOrThrow,
            Tuple.getSecond,
            Stream.decodeText("utf-8"),
            Stream.mkString
        );

        const ca = HashMap.findFirst(certs, (_stream, header) => header.filename === "certs/server/ca.pem");
        const key = HashMap.findFirst(certs, (_stream, header) => header.filename === "certs/server/key.pem");
        const cert = HashMap.findFirst(certs, (_stream, header) => header.filename === "certs/server/cert.pem");
        return yield* Effect.all(Record.map({ ca, key, cert }, readAndAssemble), { concurrency: 3 });
    });

/**
 * @since 1.0.0
 * @category Helpers
 * @internal
 */
const blobForExposeBy: (exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]) => string = Function.pipe(
    Match.type<Platforms.MobyConnectionOptions["_tag"]>(),
    Match.when("ssh", () => SshBlob.content),
    Match.when("http", () => HttpBlob.content),
    Match.when("https", () => HttpsBlob.content),
    Match.when("socket", () => SocketBlob.content),
    Match.exhaustive
);

/**
 * @since 1.0.0
 * @category Helpers
 * @internal
 */
const makeDindBinds = <ExposeDindBy extends Platforms.MobyConnectionOptions["_tag"]>(
    exposeDindBy: ExposeDindBy
): Effect.Effect<
    readonly [tempSocketDirectory: string, binds: Array<string>],
    Volumes.VolumesError | (ExposeDindBy extends "socket" ? PlatformError.PlatformError : never),
    Volumes.Volumes | Scope.Scope | (ExposeDindBy extends "socket" ? Path.Path | FileSystem.FileSystem : never)
> =>
    Effect.gen(function* () {
        const acquireScopedVolume = Effect.acquireRelease(Volumes.Volumes.create({}), ({ Name }) =>
            Effect.orDie(Volumes.Volumes.delete({ name: Name }))
        );

        const volume1 = yield* acquireScopedVolume;
        const volume2 = yield* acquireScopedVolume;

        const tempSocketDirectory = yield* Effect.if(exposeDindBy === "socket", {
            onFalse: () => Effect.succeed(""),
            onTrue: () => Effect.flatMap(FileSystem.FileSystem, (fs) => fs.makeTempDirectoryScoped()),
        });

        const mountBinds = exposeDindBy === "socket" ? [`${tempSocketDirectory}:/run/user/1000/`] : [];
        const volumeBinds = Tuple.make(
            `${volume1.Name}:/var/lib/docker`,
            `${volume2.Name}:/home/rootless/.local/share/docker`
        );
        const binds = Array.appendAll(mountBinds, volumeBinds);
        return [tempSocketDirectory, binds] as const;
    }) as Effect.Effect<
        readonly [tempSocketDirectory: string, binds: Array<string>],
        Volumes.VolumesError | (ExposeDindBy extends "socket" ? PlatformError.PlatformError : never),
        Volumes.Volumes | Scope.Scope | (ExposeDindBy extends "socket" ? Path.Path | FileSystem.FileSystem : never)
    >;

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
        SupportedConnectionOptions extends Platforms.MobyConnectionOptions = PlatformLayerConstructor extends (
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
        dindBaseImage: BlobConstants.RecommendedDindBaseImages;
    }): Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        | Images.ImagesError
        | System.SystemsError
        | Volumes.VolumesError
        | ParseResult.ParseError
        | Containers.ContainersError
        | PlatformLayerConstructorError
        | (ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never),
        | PlatformLayerConstructorContext
        | (ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never)
    > =>
        Effect.gen(function* () {
            type PlatformLayerConstructor = (
                connectionOptions: SupportedConnectionOptions
            ) => Layer.Layer<
                Layer.Layer.Success<DockerEngine.DockerLayer>,
                PlatformLayerConstructorError,
                PlatformLayerConstructorContext
            >;
            const platformLayerConstructorCasted = platformLayerConstructor as PlatformLayerConstructor;

            // Do it this way so there isn't conflicting services with the same tag in the final layer
            const hostContext = yield* Layer.build(platformLayerConstructorCasted(options.connectionOptionsToHost));
            const hostImages = Context.get(hostContext, Images.Images);
            const hostSystem = Context.get(hostContext, System.Systems);
            const hostVolumes = Context.get(hostContext, Volumes.Volumes);
            const hostContainers = Context.get(hostContext, Containers.Containers);

            // Make sure the remote docker engine host is reachable
            yield* hostSystem.pingHead();

            // Build the docker image for the dind container
            const dindTag = Array.lastNonEmpty(String.split(options.dindBaseImage, ":"));
            const dindBlob = blobForExposeBy(options.exposeDindContainerBy);
            const buildStream = DockerEngine.build({
                dockerfile: "Dockerfile",
                buildArgs: { DIND_BASE_IMAGE: options.dindBaseImage },
                tag: `the-moby-effect-${options.exposeDindContainerBy}-${dindTag}:latest`,
                context: Convey.packBuildContextIntoTarballStream(HashMap.make(["Dockerfile", dindBlob] as const)),
            }).pipe(Stream.provideService(Images.Images, hostImages));

            // Wait for the image to be built
            yield* Convey.waitForProgressToComplete(buildStream);

            // Create volumes and binds for the container so they can be cleaned up after
            const [tempSocketDirectory, binds] = yield* Effect.provideService(
                makeDindBinds(options.exposeDindContainerBy),
                Volumes.Volumes,
                hostVolumes
            );

            // Create the dind container
            const containerInspectResponse = yield* Effect.provideService(
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
                }),
                Containers.Containers,
                hostContainers
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
            const host = Function.pipe(
                Match.value<Platforms.MobyConnectionOptions>(options.connectionOptionsToHost),
                Match.tag("socket", () => "localhost" as const),
                Match.orElse(({ host }) => host)
            );

            // Wait for the dind container to be ready
            yield* Function.pipe(
                hostContainers.logs({
                    id: containerInspectResponse.Id,
                    follow: true,
                    stdout: true,
                    stderr: true,
                }),
                Stream.takeUntil(String.includes("Daemon has completed initialization")),
                Stream.runDrain
            );

            // Get the engine certificates if we are exposing the dind container by https
            const { ca, cert, key } = yield* Effect.if(options.exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed({ ca: "", cert: "", key: "" } as const),
                onTrue: () =>
                    Effect.provideService(
                        downloadDindCertificates(containerInspectResponse.Id),
                        Containers.Containers,
                        hostContainers
                    ),
            });

            // Craft the connection options
            const connectionOptions = Function.pipe(
                Match.value<Platforms.MobyConnectionOptions["_tag"]>(options.exposeDindContainerBy),
                Match.when("http", () => Platforms.HttpConnectionOptions({ host, port: httpPort })),
                Match.when("https", () => Platforms.HttpsConnectionOptions({ host, port: httpsPort, ca, key, cert })),
                Match.when("socket", () =>
                    Platforms.SocketConnectionOptions({ socketPath: `${tempSocketDirectory}/docker.sock` })
                ),
                Match.when("ssh", () =>
                    Platforms.SshConnectionOptions({
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
                System.Systems.pingHead(),
                Effect.retry(Schedule.recurs(3).pipe(Schedule.addDelay(() => 2000))),
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
export const layerAgnostic: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerAgnostic> =
    makeDindLayerFromPlatformConstructor(DockerEngine.layerAgnostic);
