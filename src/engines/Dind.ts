/**
 * Docker in docker engine helpers
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Array from "effect/Array";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Number from "effect/Number";
import * as Option from "effect/Option";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as Tuple from "effect/Tuple";

import * as Untar from "../archive/Untar.js";
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
export type DindLayer<E1 = PlatformError.PlatformError, R1 = Path.Path | FileSystem.FileSystem> = Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    | Images.ImagesError
    | System.SystemsError
    | Volumes.VolumesError
    | ParseResult.ParseError
    | Containers.ContainersError
    | E1,
    R1
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DindLayerWithoutDockerEngineRequirement = Layer.Layer<
    Layer.Layer.Success<DindLayer>,
    Layer.Layer.Error<DindLayer> | PlatformError.PlatformError,
    Layer.Layer.Context<DindLayer> | Layer.Layer.Success<DockerEngine.DockerLayer>
>;

/**
 * @since 1.0.0
 * @category Blobs
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
 * @since 1.0.0
 * @category Constants
 */
export const DefaultDindBaseImage: string = "docker.io/library/docker:dind" as const;

/**
 * Spawns a docker in docker container on the remote host provided by another
 * layer and exposes the dind container as a layer. This dind engine was built
 * to power the unit tests.
 */
const makeDindLayer = <A extends Platforms.MobyConnectionOptions["_tag"]>(
    exposeDindContainerBy: A,
    dindBaseImage: string
): Effect.Effect<
    DockerEngine.DockerLayer,
    | Images.ImagesError
    | System.SystemsError
    | Volumes.VolumesError
    | Containers.ContainersError
    | ParseResult.ParseError
    | (A extends "socket" | "ssh" ? PlatformError.PlatformError : never),
    | Scope.Scope
    | Images.Images
    | System.Systems
    | Volumes.Volumes
    | Containers.Containers
    | DockerEngine.DockerLayerConstructor
    | (A extends "socket" | "ssh" ? Path.Path | FileSystem.FileSystem : never)
> =>
    Effect.gen(function* () {
        // Make sure the remote docker engine host is reachable
        yield* System.Systems.pingHead();

        // Create a volume to store the docker engine data
        const volumeCreateResponse = yield* Effect.acquireRelease(Volumes.Volumes.create({}), ({ Name }) =>
            Effect.orDie(Volumes.Volumes.delete({ name: Name }))
        );

        // Build the docker image for the dind container
        const dindTag = Array.lastNonEmpty(String.split(dindBaseImage, ":"));
        const dindBlob = blobForExposeBy(exposeDindContainerBy);
        const buildStream = DockerEngine.build({
            dockerfile: "Dockerfile",
            buildArgs: { DIND_BASE_IMAGE: dindBaseImage },
            tag: `the-moby-effect-${exposeDindContainerBy}-${dindTag}:latest`,
            context: Convey.packBuildContextIntoTarballStream(HashMap.make(["Dockerfile", dindBlob] as const)),
        });

        // Wait for the image to be built
        yield* Convey.waitForProgressToComplete(buildStream);

        // Create a temporary directory to store the docker socket
        const bindsEffect: Effect.Effect<
            readonly [tempSocketDirectory: string, binds: Array<string>],
            A extends "socket" | "ssh" ? PlatformError.PlatformError : never,
            A extends "socket" | "ssh" ? Path.Path | FileSystem.FileSystem : never
        > = Effect.if(exposeDindContainerBy === "socket", {
            onFalse: () => Effect.succeed(Tuple.make("", Tuple.make(`${volumeCreateResponse.Name}:/var/lib/docker`))),
            onTrue: () =>
                Effect.gen(function* () {
                    const filesystem = yield* FileSystem.FileSystem;
                    const tempSocketDirectory = yield* filesystem.makeTempDirectoryScoped();
                    const binds = Tuple.make(
                        `${tempSocketDirectory}/:/var/run/`,
                        `${volumeCreateResponse.Name}:/var/lib/docker`
                    );
                    return Tuple.make(tempSocketDirectory, binds);
                }),
        }) as any;

        const [tempSocketDirectory, binds] = yield* bindsEffect;

        // Create the dind container
        const containerInspectResponse = yield* DockerEngine.runScoped({
            spec: {
                Image: `the-moby-effect-${exposeDindContainerBy}-${dindTag}:latest`,
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
        });

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
            Containers.Containers.logs({
                id: containerInspectResponse.Id,
                follow: true,
                stdout: true,
                stderr: true,
            }),
            Stream.unwrap,
            Stream.takeUntil(String.includes("Daemon has completed initialization")),
            Stream.runDrain
        );

        const certs = yield* Effect.flatMap(
            Containers.Containers.archive({ id: containerInspectResponse.Id, path: "/certs" }),
            (stream) => Untar.Untar(stream)
        );
        const ca = yield* Function.pipe(
            HashMap.findFirst(certs, (stream, tarHeader) => tarHeader.filename === "server/ca.pem"),
            Option.getOrThrow,
            Tuple.getSecond,
            Stream.decodeText("utf-8"),
            Stream.mkString
        );
        const key = "";
        const cert = "";

        // Craft the connection options
        const connectionOptions: A extends "socket" | "ssh"
            ? Platforms.MobyConnectionOptions
            : Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged = Function.pipe(
            Match.value<Platforms.MobyConnectionOptions["_tag"]>(exposeDindContainerBy),
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
        ) as any;

        // Build the layer for the same platform that we are on
        const layerConstructor =
            yield* DockerEngine.PlatformLayerConstructor<
                A extends "socket" | "ssh"
                    ? Platforms.MobyConnectionOptions
                    : Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
            >();
        const layer = layerConstructor(connectionOptions);

        // Test that the dind container is reachable
        yield* Function.pipe(
            System.Systems.pingHead(),
            Effect.retry(Schedule.recurs(3).pipe(Schedule.addDelay(() => 2000))),
            Effect.provide(layer)
        );

        return layer;
    });

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerNodeJS = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: Platforms.MobyConnectionOptions;
    exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"];
}): DindLayer =>
    Layer.unwrapScoped(
        Effect.provide(
            makeDindLayer(options.exposeDindContainerBy, options.dindBaseImage ?? DefaultDindBaseImage),
            DockerEngine.layerNodeJS(options.connectionOptionsToHost)
        )
    );

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerBun = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: Platforms.MobyConnectionOptions;
    exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"];
}): DindLayer =>
    Layer.unwrapScoped(
        Effect.provide(
            makeDindLayer(options.exposeDindContainerBy, options.dindBaseImage ?? DefaultDindBaseImage),
            DockerEngine.layerBun(options.connectionOptionsToHost)
        )
    );

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerDeno = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: Platforms.MobyConnectionOptions;
    exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"];
}): DindLayer =>
    Layer.unwrapScoped(
        Effect.provide(
            makeDindLayer(options.exposeDindContainerBy, options.dindBaseImage ?? DefaultDindBaseImage),
            DockerEngine.layerDeno(options.connectionOptionsToHost)
        )
    );

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerUndici = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: Platforms.MobyConnectionOptions;
    exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"];
}): DindLayer =>
    Layer.unwrapScoped(
        Effect.provide(
            makeDindLayer(options.exposeDindContainerBy, options.dindBaseImage ?? DefaultDindBaseImage),
            DockerEngine.layerUndici(options.connectionOptionsToHost)
        )
    );

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerWeb = (options: {
    dindBaseImage?: string | undefined;
    exposeDindContainerBy: "http" | "https";
    connectionOptionsToHost: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged;
}): DindLayer<never, never> =>
    Layer.unwrapScoped(
        Effect.provide(
            makeDindLayer(options.exposeDindContainerBy, options.dindBaseImage ?? DefaultDindBaseImage),
            DockerEngine.layerWeb(options.connectionOptionsToHost)
        )
    );
