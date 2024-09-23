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
import * as Schedule from "effect/Schedule";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as Tuple from "effect/Tuple";

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
 * @category Blobs
 * @internal
 */
export const blobForExposeBy: (exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]) => string =
    Function.pipe(
        Match.type<Platforms.MobyConnectionOptions["_tag"]>(),
        Match.when("ssh", () => SshBlob.content),
        Match.when("http", () => HttpBlob.content),
        Match.when("https", () => HttpsBlob.content),
        Match.when("socket", () => SocketBlob.content),
        Match.exhaustive
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

            // Create a volume to store the docker engine data
            const volumeCreateResponse = yield* Effect.acquireRelease(hostVolumes.create({}), ({ Name }) =>
                Effect.orDie(hostVolumes.delete({ name: Name }))
            );

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

            // Create a temporary directory to store the docker socket
            const bindsEffect = Effect.if(options.exposeDindContainerBy === "socket", {
                onFalse: () =>
                    Effect.succeed(Tuple.make("", Tuple.make(`${volumeCreateResponse.Name}:/var/lib/docker`))),
                onTrue: () =>
                    Effect.gen(function* () {
                        const filesystem = yield* FileSystem.FileSystem;
                        // FIXME: this should be makeTempDirectoryScoped
                        const tempSocketDirectory = yield* filesystem.makeTempDirectory();
                        const binds = Tuple.make(
                            `${tempSocketDirectory}/:/run/user/1000/`,
                            `${volumeCreateResponse.Name}:/var/lib/docker`
                        );
                        return Tuple.make(tempSocketDirectory, binds);
                    }),
            }) as Effect.Effect<
                readonly [tempSocketDirectory: string, binds: Array<string>],
                ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never,
                ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never
            >;

            const [tempSocketDirectory, binds] = yield* bindsEffect;

            // Create the dind container
            const containerInspectResponse = yield* DockerEngine.runScoped({
                spec: {
                    Image: `the-moby-effect-${options.exposeDindContainerBy}-${dindTag}:latest`,
                    Volumes: { "/var/lib/docker": {} },
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
            }).pipe(Effect.provideService(Containers.Containers, hostContainers));

            // Extract the ports from the container inspect response
            const tryGetPort = Function.flow(
                Option.fromNullable<string | undefined>,
                Option.flatMap(Number.parse),
                Option.getOrThrow
            );
            const sshPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["22/tcp"]?.[0]?.HostPort);
            const httpPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort);

            // Extract the host from the container inspect response
            const host = Function.pipe(
                containerInspectResponse.NetworkSettings?.IPAddress,
                Option.fromNullable,
                Option.getOrThrow
            );
            const gateway = Function.pipe(
                containerInspectResponse.NetworkSettings?.Gateway,
                Option.fromNullable,
                Option.getOrThrow
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

            const certs = yield* Untar.Untar(
                hostContainers.archive({ id: containerInspectResponse.Id, path: "/certs" })
            );
            const ca = yield* Effect.if(options.exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed(""),
                onTrue: () =>
                    Function.pipe(
                        HashMap.findFirst(certs, (stream, tarHeader) => tarHeader.filename === "certs/server/ca.pem"),
                        Option.getOrThrow,
                        Tuple.getSecond,
                        Stream.decodeText("utf-8"),
                        Stream.mkString
                    ),
            });
            const key = yield* Effect.if(options.exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed(""),
                onTrue: () =>
                    Function.pipe(
                        HashMap.findFirst(certs, (stream, tarHeader) => tarHeader.filename === "certs/server/key.pem"),
                        Option.getOrThrow,
                        Tuple.getSecond,
                        Stream.decodeText("utf-8"),
                        Stream.mkString
                    ),
            });
            const cert = yield* Effect.if(options.exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed(""),
                onTrue: () =>
                    Function.pipe(
                        HashMap.findFirst(certs, (stream, tarHeader) => tarHeader.filename === "certs/server/cert.pem"),
                        Option.getOrThrow,
                        Tuple.getSecond,
                        Stream.decodeText("utf-8"),
                        Stream.mkString
                    ),
            });

            // Craft the connection options
            const connectionOptions = Function.pipe(
                Match.value<Platforms.MobyConnectionOptions["_tag"]>(options.exposeDindContainerBy),
                Match.when("http", () => Platforms.HttpConnectionOptions({ host: gateway, port: httpPort })),
                Match.when("https", () => Platforms.HttpsConnectionOptions({ host, port: 2376, ca, key, cert })),
                Match.when("socket", () =>
                    Platforms.SocketConnectionOptions({ socketPath: `${tempSocketDirectory}/docker.sock` })
                ),
                Match.when("ssh", () =>
                    Platforms.SshConnectionOptions({
                        host: gateway,
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
