/**
 * Docker in docker engine helpers
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Array from "effect/Array";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as Schedule from "effect/Schedule";
import * as Stream from "effect/Stream";
import * as String from "effect/String";

import * as Convey from "../Convey.js";
import * as Containers from "../endpoints/Containers.js";
import * as Images from "../endpoints/Images.js";
import * as System from "../endpoints/System.js";
import * as Volumes from "../endpoints/Volumes.js";
import * as PlatformAgents from "../PlatformAgents.js";
import * as DockerEngine from "./Docker.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type DindLayer = Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    | Images.ImagesError
    | Containers.ContainersError
    | Volumes.VolumesError
    | System.SystemsError
    | PlatformError.PlatformError,
    Path.Path | FileSystem.FileSystem
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DindLayerWithoutDockerEngineRequirement<E1 = never> = Layer.Layer<
    Layer.Layer.Success<DindLayer>,
    E1 | Layer.Layer.Error<DindLayer> | PlatformError.PlatformError,
    Layer.Layer.Context<DindLayer> | Layer.Layer.Success<DockerEngine.DockerLayer> | Path.Path | FileSystem.FileSystem
>;

/**
 * Spawns a docker in docker container on the remote host provided by another
 * layer and exposes the dind container as a layer. This dind engine was built
 * to power the unit tests.
 */
const makeDindLayer = <E1 = never>(
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"],
    dindBaseImage: string
): DindLayerWithoutDockerEngineRequirement<E1> =>
    Layer.unwrapScoped(
        Effect.gen(function* () {
            const path: Path.Path = yield* Path.Path;
            const filesystem: FileSystem.FileSystem = yield* FileSystem.FileSystem;

            // Make sure the remote docker engine host is reachable
            yield* System.Systems.pingHead();

            // Create a volume to store the docker engine data
            const volumeCreateResponse = yield* Effect.acquireRelease(Volumes.Volumes.create({}), ({ Name }) =>
                Effect.orDie(Volumes.Volumes.delete({ name: Name }))
            );

            // Build the docker image for the dind container
            const dindTag = Array.lastNonEmpty(String.split(dindBaseImage, ":"));
            const cwd = yield* path.fromFileUrl(new URL("../../docker/", import.meta.url));
            const buildStream = DockerEngine.build({
                buildArgs: { DIND_BASE_IMAGE: dindBaseImage },
                dockerfile: `dind-${exposeDindContainerBy}.dockerfile`,
                tag: `the-moby-effect-${exposeDindContainerBy}-${dindTag}:latest`,
                context: Convey.packBuildContextIntoTarballStream(cwd, [`dind-${exposeDindContainerBy}.dockerfile`]),
            });

            // Wait for the image to be built
            yield* Convey.followProgressInConsole(buildStream);

            // Create a temporary directory to store the docker socket
            const tempCertsDirectory = yield* filesystem.makeTempDirectory();
            const tempSocketDirectory = yield* filesystem.makeTempDirectoryScoped();

            // Create the dind container
            const containerInspectResponse = yield* DockerEngine.runScoped({
                spec: {
                    Image: `the-moby-effect-${exposeDindContainerBy}-${dindTag}:latest`,
                    Volumes: { "/var/lib/docker": {} },
                    HostConfig: {
                        Privileged: true,
                        Binds: [
                            `${tempCertsDirectory}/:/certs/`,
                            `${tempSocketDirectory}/:/var/run/`,
                            `${volumeCreateResponse.Name}:/var/lib/docker`,
                        ],
                    },
                },
            });

            const host = Function.pipe(
                containerInspectResponse.NetworkSettings?.IPAddress,
                Option.fromNullable,
                Option.getOrThrow
            );

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

            const ca = yield* Effect.if(exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed(undefined),
                onTrue: () => filesystem.readFileString(path.join(tempCertsDirectory, "server", "ca.pem")),
            });
            const key = yield* Effect.if(exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed(undefined),
                onTrue: () => filesystem.readFileString(path.join(tempCertsDirectory, "server", "key.pem")),
            });
            const cert = yield* Effect.if(exposeDindContainerBy === "https", {
                onFalse: () => Effect.succeed(undefined),
                onTrue: () => filesystem.readFileString(path.join(tempCertsDirectory, "server", "cert.pem")),
            });

            // Craft the connection options
            const connectionOptions: PlatformAgents.MobyConnectionOptions = Function.pipe(
                Match.value(exposeDindContainerBy),
                Match.when("http", () => PlatformAgents.HttpConnectionOptions({ host, port: 2375 })),
                Match.when("socket", () =>
                    PlatformAgents.SocketConnectionOptions({ socketPath: `${tempSocketDirectory}/docker.sock` })
                ),
                Match.when("https", () => PlatformAgents.HttpsConnectionOptions({ host, port: 2376, ca, key, cert })),
                Match.when("ssh", () =>
                    PlatformAgents.SshConnectionOptions({
                        host,
                        port: 22,
                        username: "root",
                        password: "password",
                        remoteSocketPath: "/var/run/docker.sock",
                    })
                ),
                Match.exhaustive
            );

            // Build the layer for the same platform that we are on
            const layerConstructor = yield* DockerEngine.PlatformLayerConstructor<E1>();
            const layer = layerConstructor(connectionOptions);

            // Test that the dind container is reachable
            yield* Function.pipe(
                System.Systems.pingHead(),
                Effect.retry(Schedule.recurs(3).pipe(Schedule.addDelay(() => 2000))),
                Effect.provide(layer)
            );

            return layer;
        })
    );

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerNodeJS = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: PlatformAgents.MobyConnectionOptions;
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"];
}): DindLayer => {
    const intermediateLayer = DockerEngine.layerNodeJS(options.connectionOptionsToHost);
    const dindLayer = makeDindLayer(
        options.exposeDindContainerBy,
        options.dindBaseImage ?? "docker.io/library/docker:dind"
    );
    return Layer.provide(dindLayer, intermediateLayer);
};

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerBun = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: PlatformAgents.MobyConnectionOptions;
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"];
}): DindLayer => {
    const intermediateLayer = DockerEngine.layerBun(options.connectionOptionsToHost);
    const dindLayer = makeDindLayer(
        options.exposeDindContainerBy,
        options.dindBaseImage ?? "docker.io/library/docker:dind"
    );
    return Layer.provide(dindLayer, intermediateLayer);
};

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerDeno = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: PlatformAgents.MobyConnectionOptions;
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"];
}): DindLayer => {
    const intermediateLayer = DockerEngine.layerDeno(options.connectionOptionsToHost);
    const dindLayer = makeDindLayer(
        options.exposeDindContainerBy,
        options.dindBaseImage ?? "docker.io/library/docker:dind"
    );
    return Layer.provide(dindLayer, intermediateLayer);
};

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerUndici = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: PlatformAgents.MobyConnectionOptions;
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"];
}): DindLayer => {
    const intermediateLayer = DockerEngine.layerUndici(options.connectionOptionsToHost);
    const dindLayer = makeDindLayer(
        options.exposeDindContainerBy,
        options.dindBaseImage ?? "docker.io/library/docker:dind"
    );
    return Layer.provide(dindLayer, intermediateLayer);
};

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerWeb = (options: {
    dindBaseImage?: string | undefined;
    connectionOptionsToHost: PlatformAgents.MobyConnectionOptions;
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"];
}): Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    | ConfigError.ConfigError
    | Images.ImagesError
    | Containers.ContainersError
    | Volumes.VolumesError
    | System.SystemsError
    | PlatformError.PlatformError,
    Path.Path | FileSystem.FileSystem
> => {
    const intermediateLayer = DockerEngine.layerWeb(options.connectionOptionsToHost);
    const dindLayer = makeDindLayer<ConfigError.ConfigError>(
        options.exposeDindContainerBy,
        options.dindBaseImage ?? "docker.io/library/docker:dind"
    );
    return Layer.provide(dindLayer, intermediateLayer);
};
