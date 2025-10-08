/**
 * Docker engine.
 *
 * @since 1.0.0
 */

import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Socket from "@effect/platform/Socket";
import type * as Schemas from "effect-schemas";
import type * as Effect from "effect/Effect";
import type * as ParseResult from "effect/ParseResult";
import type * as Schema from "effect/Schema";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type * as IdSchemas from "./internal/schemas/id.js";
import type * as MobyConnection from "./MobyConnection.js";
import type * as MobyDemux from "./MobyDemux.js";
import type * as MobySchemas from "./MobySchemas.js";

import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as MobyEndpoints from "./MobyEndpoints.js";
import * as MobyPlatforms from "./MobyPlatforms.js";

import * as internalCircular from "./internal/endpoints/circular.ts";
import * as internalDocker from "./internal/engines/docker.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const DockerErrorTypeId: unique symbol = internalCircular.DockerErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type DockerErrorTypeId = typeof DockerErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isDockerError: (u: unknown) => u is DockerError = internalCircular.isDockerError;

/**
 * @since 1.0.0
 * @category Errors
 */
export type DockerError = internalCircular.DockerError;

/**
 * @since 1.0.0
 * @category Errors
 */
export const DockerError: typeof internalCircular.DockerError = internalCircular.DockerError;

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
    | MobyEndpoints.System
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
    MobyEndpoints.SystemLayer,
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
    buildargs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
    buildargs?: Record<string, string | undefined> | undefined;
}) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images> = internalDocker.build;

/**
 * Implements the `docker build` command as a scoped effect. When the scope is
 * closed, the built image is removed. It doesn't have all the flags that the
 * images build endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const buildScoped: <E1>({
    buildargs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    buildargs?: Record<string, string | undefined> | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
}) => Effect.Effect<
    Stream.Stream<MobySchemas.JSONMessage, DockerError, never>,
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
    command: string | Array<string>;
    containerId: IdSchemas.ContainerIdentifier;
}) => Effect.Effect<
    [exitCode: Schema.Schema.Type<Schemas.Number.I64>, output: string],
    Socket.SocketError | ParseResult.ParseError | DockerError,
    MobyEndpoints.Execs
> = internalDocker.exec;

/**
 * Implements the `docker exec` command in a non blocking fashion. Incompatible
 * with web when not detached.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execNonBlocking: <const T extends boolean = false>({
    command,
    containerId,
    detach,
}: {
    detach: T;
    command: string | Array<string>;
    containerId: IdSchemas.ContainerIdentifier;
}) => Effect.Effect<
    [[T] extends [false] ? MobyDemux.RawSocket | MobyDemux.MultiplexedSocket : void, IdSchemas.ExecIdentifier],
    Socket.SocketError | ParseResult.ParseError | DockerError,
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
    containerId: IdSchemas.ContainerIdentifier;
}) => Effect.Effect<
    readonly [stdout: string, stderr: string],
    Socket.SocketError | ParseResult.ParseError | DockerError,
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
    containerId: IdSchemas.ContainerIdentifier;
    cwd?: string | undefined;
}) => Effect.Effect<
    MobyDemux.MultiplexedChannel<never, Socket.SocketError | DockerError, never>,
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
) => Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, DockerError, MobyEndpoints.Images> = internalDocker.images;

/**
 * Implements the `docker info` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const info: () => Effect.Effect<MobySchemas.SystemInfo, DockerError, MobyEndpoints.System> = internalDocker.info;

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ping: () => Effect.Effect<void, DockerError, MobyEndpoints.System> = internalDocker.ping;

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pingHead: () => Effect.Effect<void, DockerError, MobyEndpoints.System> = internalDocker.pingHead;

/**
 * Implements the `docker ps` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ps: (
    options?: Parameters<MobyEndpoints.Containers["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ContainerSummary>, DockerError, MobyEndpoints.Containers> =
    internalDocker.ps;

/**
 * Implements the `docker pull` command. It does not have all the flags that the
 * images create endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pull: ({
    image,
    platform,
}: {
    image: string;
    platform?: string | undefined;
}) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images> = internalDocker.pull;

/**
 * Implements the `docker pull` command as a scoped effect. When the scope is
 * closed, the pulled image is removed. It doesn't have all the flag =
 * internalDocker.flags that the images create endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pullScoped: ({
    image,
    platform,
}: {
    image: string;
    platform?: string | undefined;
}) => Effect.Effect<
    Stream.Stream<MobySchemas.JSONMessage, DockerError, never>,
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
    name: string,
    options: Parameters<MobyEndpoints.Images["push"]>[1]
) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images> = internalDocker.push;

/**
 * Implements `docker run` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const run: (
    options: Omit<ConstructorParameters<typeof MobySchemas.ContainerCreateRequest>[0], "HostConfig"> & {
        readonly name?: string | undefined;
        readonly platform?: string | undefined;
        readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined;
    }
) => Effect.Effect<MobySchemas.ContainerInspectResponse, DockerError, MobyEndpoints.Containers> = internalDocker.run;

/**
 * Implements `docker run` command as a scoped effect. When the scope is closed,
 * both the image and the container is removed = internalDocker.removed.
 *
 * @since 1.0.0
 * @category Docker
 */
export const runScoped: (
    options: Omit<ConstructorParameters<typeof MobySchemas.ContainerCreateRequest>[0], "HostConfig"> & {
        readonly name?: string | undefined;
        readonly platform?: string | undefined;
        readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined;
    }
) => Effect.Effect<MobySchemas.ContainerInspectResponse, DockerError, Scope.Scope | MobyEndpoints.Containers> =
    internalDocker.runScoped;

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search: (
    options: Parameters<MobyEndpoints.Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResult>, DockerError, MobyEndpoints.Images> =
    internalDocker.search;

/**
 * Implements the `docker start` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const start: (
    containerId: IdSchemas.ContainerIdentifier
) => Effect.Effect<void, DockerError, MobyEndpoints.Containers> = internalDocker.start;

/**
 * Implements the `docker stop` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const stop: (
    containerId: IdSchemas.ContainerIdentifier
) => Effect.Effect<void, DockerError, MobyEndpoints.Containers> = internalDocker.stop;

/**
 * Implements the `docker version` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const version: () => Effect.Effect<MobySchemas.TypesVersion, DockerError, MobyEndpoints.System> =
    internalDocker.version;
