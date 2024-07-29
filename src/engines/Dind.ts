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
import * as Number from "effect/Number";
import * as Option from "effect/Option";
import * as Schedule from "effect/Schedule";
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
 * layer and exposes the dind container as a layer.
 */
const makeDindLayer = <E1 = never>(
    exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"],
    dindBaseImage: string
): DindLayerWithoutDockerEngineRequirement<E1> =>
    Layer.unwrapScoped(
        Effect.gen(function* () {
            const path: Path.Path = yield* Path.Path;
            const systems: System.SystemsImpl = yield* System.Systems;
            const volumes: Volumes.VolumesImpl = yield* Volumes.Volumes;
            const filesystem: FileSystem.FileSystem = yield* FileSystem.FileSystem;

            // Make sure the remote docker engine host is reachable
            yield* systems.pingHead();

            // Create a volume to store the docker engine data
            const volumeCreateResponse = yield* Effect.acquireRelease(volumes.create({}), ({ Name }) =>
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
            const tempSocketMount = yield* filesystem.makeTempDirectoryScoped();

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
                        Binds: [`${tempSocketMount}/:/var/run/`, `${volumeCreateResponse.Name}:/var/lib/docker`],
                        PortBindings: {
                            "22/tcp": [{ HostPort: "0" }],
                            "2375/tcp": [{ HostPort: "0" }],
                            "2376/tcp": [{ HostPort: "0" }],
                        },
                    },
                },
            });

            // Extract the host and ports from the container inspect response
            const tryGetPort = Function.flow(
                Option.fromNullable<string | undefined>,
                Option.flatMap(Number.parse),
                Option.getOrThrow
            );
            const sshPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["22/tcp"]?.[0]?.HostPort);
            const httpPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort);
            const httpsPort = tryGetPort(containerInspectResponse.NetworkSettings?.Ports?.["2376/tcp"]?.[0]?.HostPort);
            const host = Option.fromNullable(containerInspectResponse.NetworkSettings?.Gateway).pipe(Option.getOrThrow);

            // Craft the connection options
            const connectionOptions: PlatformAgents.MobyConnectionOptions = Function.pipe(
                Match.value(exposeDindContainerBy),
                Match.when("http", () => PlatformAgents.HttpConnectionOptions({ host, port: httpPort })),
                Match.when("https", () => PlatformAgents.HttpsConnectionOptions({ host, port: httpsPort })),
                Match.when("socket", () =>
                    PlatformAgents.SocketConnectionOptions({ socketPath: `${tempSocketMount}/docker.sock` })
                ),
                Match.when("ssh", () =>
                    PlatformAgents.SshConnectionOptions({
                        host,
                        port: sshPort,
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
