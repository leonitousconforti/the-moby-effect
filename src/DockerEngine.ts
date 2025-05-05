/**
 * Docker engine.
 *
 * @since 1.0.0
 */

import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Socket from "@effect/platform/Socket";
import type * as Effect from "effect/Effect";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type * as MobyConnection from "./MobyConnection.js";
import type * as MobyDemux from "./MobyDemux.js";
import type * as MobySchemas from "./MobySchemas.js";

import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as MobyEndpoints from "./MobyEndpoints.js";
import * as MobyPlatforms from "./MobyPlatforms.js";

import * as internalDocker from "./internal/engines/docker.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayer = Layer.Layer<
    | MobyEndpoints.Configs
    | MobyEndpoints.Containers
    | MobyEndpoints.Distributions
    | MobyEndpoints.Execs
    | MobyEndpoints.Images
    | MobyEndpoints.Networks
    | MobyEndpoints.Nodes
    | MobyEndpoints.Plugins
    | MobyEndpoints.Secrets
    | MobyEndpoints.Services
    | MobyEndpoints.Sessions
    | MobyEndpoints.Swarm
    | MobyEndpoints.Systems
    | MobyEndpoints.Tasks
    | MobyEndpoints.Volumes,
    never,
    never
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
    Layer.Layer.Success<DockerLayer>,
    Layer.Layer.Error<DockerLayer>,
    Layer.Layer.Context<DockerLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: DockerLayerWithoutHttpClientOrWebsocketConstructor = Layer.mergeAll(
    MobyEndpoints.ConfigsLayer,
    MobyEndpoints.ContainersLayer,
    MobyEndpoints.DistributionsLayer,
    MobyEndpoints.ExecsLayer,
    MobyEndpoints.ImagesLayer,
    MobyEndpoints.NetworksLayer,
    MobyEndpoints.NodesLayer,
    MobyEndpoints.PluginsLayer,
    MobyEndpoints.SecretsLayer,
    MobyEndpoints.ServicesLayer,
    MobyEndpoints.SessionsLayer,
    MobyEndpoints.SwarmLayer,
    MobyEndpoints.SystemsLayer,
    MobyEndpoints.TasksLayer,
    MobyEndpoints.VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer = Function.compose(
    MobyPlatforms.makeNodeHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer = Function.compose(
    MobyPlatforms.makeBunHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer = Function.compose(
    MobyPlatforms.makeDenoHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer = Function.compose(
    MobyPlatforms.makeUndiciHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer = Function.compose(MobyPlatforms.makeWebHttpClientLayer, (httpClientLayer) =>
    Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer = Function.compose(MobyPlatforms.makeFetchHttpClientLayer, (httpClientLayer) =>
    Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor = Function.compose(
    MobyPlatforms.makeAgnosticHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * Implements the `docker build` command. It doesn't have all the flags that the
 * images build endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const build: <E1>({
    auth,
    buildArgs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    auth?: string | undefined;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
    buildArgs?: Record<string, string | undefined> | undefined;
}) => Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images> = internalDocker.build;

/**
 * Implements the `docker build` command as a scoped effect. When the scope is
 * closed, the built image is removed. It doesn't have all the flags that the
 * images build endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const buildScoped: <E1>({
    auth,
    buildArgs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    auth?: string | undefined;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    buildArgs?: Record<string, string | undefined> | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
}) => Effect.Effect<
    Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, never>,
    never,
    Scope.Scope | MobyEndpoints.Images
> = internalDocker.buildScoped;

/**
 * Implements the `docker exec` command in a blocking fashion. Incompatible with
 * web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const exec: ({
    command,
    containerId,
}: {
    containerId: string;
    command: string | Array<string>;
}) => Effect.Effect<
    readonly [exitCode: number, output: string],
    MobyEndpoints.ExecsError | Socket.SocketError | ParseResult.ParseError,
    MobyEndpoints.Execs
> = internalDocker.exec;

/**
 * Implements the `docker exec` command in a non blocking fashion. Incompatible
 * with web when not detached.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execNonBlocking: <T extends boolean | undefined = undefined>({
    command,
    containerId,
    detach,
}: {
    detach?: T;
    containerId: string;
    command: string | Array<string>;
}) => Effect.Effect<
    [socket: T extends true ? void : MobyDemux.RawSocket | MobyDemux.MultiplexedSocket, execId: string],
    MobyEndpoints.ExecsError,
    MobyEndpoints.Execs
> = internalDocker.execNonBlocking;

/**
 * Implements the `docker exec` command in a blocking fashion with websockets as
 * the underlying transport instead of the docker engine exec apis so that is
 * can be compatible with web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execWebsockets: ({
    command,
    containerId,
}: {
    command: string | Array<string>;
    containerId: string;
}) => Effect.Effect<
    readonly [stdout: string, stderr: string],
    MobyEndpoints.ContainersError | Socket.SocketError | ParseResult.ParseError,
    MobyEndpoints.Containers
> = internalDocker.execWebsockets;

/**
 * Implements the `docker exec` command in a non blocking fashion with
 * websockets as the underlying transport instead of the docker engine exec apis
 * so that is can be compatible with web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execWebsocketsNonBlocking: ({
    command,
    containerId,
    cwd,
}: {
    command: string | Array<string>;
    containerId: string;
    cwd?: string | undefined;
}) => Effect.Effect<
    MobyDemux.MultiplexedChannel<never, Socket.SocketError | MobyEndpoints.ContainersError, never>,
    never,
    MobyEndpoints.Containers
> = internalDocker.execWebsocketsNonBlocking;

/**
 * Implements the `docker images` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const images: (
    options?: Parameters<MobyEndpoints.Images["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, MobyEndpoints.ImagesError, MobyEndpoints.Images> =
    internalDocker.images;

/**
 * Implements the `docker info` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const info: () => Effect.Effect<
    Readonly<MobySchemas.SystemInfoResponse>,
    MobyEndpoints.SystemsError,
    MobyEndpoints.Systems
> = internalDocker.info;

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ping: () => Effect.Effect<"OK", MobyEndpoints.SystemsError, MobyEndpoints.Systems> = internalDocker.ping;

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pingHead: () => Effect.Effect<void, MobyEndpoints.SystemsError, MobyEndpoints.Systems> =
    internalDocker.pingHead;

/**
 * Implements the `docker ps` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ps: (
    options?: Parameters<MobyEndpoints.Containers["list"]>[0]
) => Effect.Effect<
    ReadonlyArray<MobySchemas.ContainerListResponseItem>,
    MobyEndpoints.ContainersError,
    MobyEndpoints.Containers
> = internalDocker.ps;

/**
 * Implements the `docker pull` command. It does not have all the flags that the
 * images create endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pull: ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}) => Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images> = internalDocker.pull;

/**
 * Implements the `docker pull` command as a scoped effect. When the scope is
 * closed, the pulled image is removed. It doesn't have all the flag =
 * internalDocker.flags that the images create endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pullScoped: ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}) => Effect.Effect<
    Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, never>,
    never,
    MobyEndpoints.Images | Scope.Scope
> = internalDocker.pullScoped;

/**
 * Implements the `docker push` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const push: (
    options: Parameters<MobyEndpoints.Images["push"]>[0]
) => Stream.Stream<string, MobyEndpoints.ImagesError, MobyEndpoints.Images> = internalDocker.push;

/**
 * Implements `docker run` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const run: (
    containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
) => Effect.Effect<MobySchemas.ContainerInspectResponse, MobyEndpoints.ContainersError, MobyEndpoints.Containers> =
    internalDocker.run;

/**
 * Implements `docker run` command as a scoped effect. When the scope is closed,
 * both the image and the container is removed = internalDocker.removed.
 *
 * @since 1.0.0
 * @category Docker
 */
export const runScoped: (
    containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
) => Effect.Effect<
    MobySchemas.ContainerInspectResponse,
    MobyEndpoints.ContainersError,
    Scope.Scope | MobyEndpoints.Containers
> = internalDocker.runScoped;

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search: (
    options: Parameters<MobyEndpoints.Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResponse>, MobyEndpoints.ImagesError, MobyEndpoints.Images> =
    internalDocker.search;

/**
 * Implements the `docker start` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const start: (
    containerId: string
) => Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers> = internalDocker.start;

/**
 * Implements the `docker stop` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const stop: (
    containerId: string
) => Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers> = internalDocker.stop;

/**
 * Implements the `docker version` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const version: () => Effect.Effect<
    Readonly<MobySchemas.SystemVersionResponse>,
    MobyEndpoints.SystemsError,
    MobyEndpoints.Systems
> = internalDocker.version;
