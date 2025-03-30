/**
 * Docker engine shortcut.
 *
 * @since 1.0.0
 */

import type * as Socket from "@effect/platform/Socket";
import type * as Effect from "effect/Effect";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type * as Endpoints from "./MobyEndpoints.js";
import type * as Schemas from "./MobySchemas.js";

import * as internal from "./internal/engines/docker.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayer = internal.DockerLayer;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayerWithoutHttpClientOrWebsocketConstructor =
    internal.DockerLayerWithoutHttpClientOrWebsocketConstructor;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic = internal.layerAgnostic;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun = internal.layerBun;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno = internal.layerDeno;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch = internal.layerFetch;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS = internal.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici = internal.layerUndici;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb = internal.layerWeb;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient = internal.layerWithoutHttpCLient;

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
}) => Stream.Stream<Schemas.JSONMessage, Endpoints.ImagesError, Endpoints.Images> = internal.build;

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
    Stream.Stream<Schemas.JSONMessage, Endpoints.ImagesError, never>,
    never,
    Scope.Scope | Endpoints.Images
> = internal.buildScoped;

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
    Endpoints.ExecsError | Socket.SocketError | ParseResult.ParseError,
    Endpoints.Execs
> = internal.exec;

/**
 * Implements the `docker exec` command in a non blocking fashion. Incompatible
 * with web when not detached.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execNonBlocking = internal.execNonBlocking;

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
    Endpoints.ContainersError | Socket.SocketError | ParseResult.ParseError,
    Endpoints.Containers
> = internal.execWebsockets;

/**
 * Implements the `docker exec` command in a non blocking fashion with
 * websockets as the underlying transport instead of the docker engine exec apis
 * so that is can be compatible with web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execWebsocketsNonBlocking = internal.execWebsocketsNonBlocking;

/**
 * Implements the `docker images` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const images: (
    options?: Parameters<Endpoints.Images["list"]>[0]
) => Effect.Effect<ReadonlyArray<Schemas.ImageSummary>, Endpoints.ImagesError, Endpoints.Images> = internal.images;

/**
 * Implements the `docker info` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const info: () => Effect.Effect<
    Readonly<Schemas.SystemInfoResponse>,
    Endpoints.SystemsError,
    Endpoints.Systems
> = internal.info;

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ping: () => Effect.Effect<"OK", Endpoints.SystemsError, Endpoints.Systems> = internal.ping;

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pingHead: () => Effect.Effect<void, Endpoints.SystemsError, Endpoints.Systems> = internal.pingHead;

/**
 * Implements the `docker ps` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ps: (
    options?: Parameters<Endpoints.Containers["list"]>[0]
) => Effect.Effect<ReadonlyArray<Schemas.ContainerListResponseItem>, Endpoints.ContainersError, Endpoints.Containers> =
    internal.ps;

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
}) => Stream.Stream<Schemas.JSONMessage, Endpoints.ImagesError, Endpoints.Images> = internal.pull;

/**
 * Implements the `docker pull` command as a scoped effect. When the scope is
 * closed, the pulled image is removed. It doesn't have all the flag =
 * internal.flags that the images create endpoint exposes.
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
    Stream.Stream<Schemas.JSONMessage, Endpoints.ImagesError, never>,
    never,
    Endpoints.Images | Scope.Scope
> = internal.pullScoped;

/**
 * Implements the `docker push` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const push: (
    options: Parameters<Endpoints.Images["push"]>[0]
) => Stream.Stream<string, Endpoints.ImagesError, Endpoints.Images> = internal.push;

/**
 * Implements `docker run` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const run: (
    containerOptions: Parameters<Endpoints.Containers["create"]>[0]
) => Effect.Effect<Schemas.ContainerInspectResponse, Endpoints.ContainersError, Endpoints.Containers> = internal.run;

/**
 * Implements `docker run` command as a scoped effect. When the scope is closed,
 * both the image and the container is removed = internal.removed.
 *
 * @since 1.0.0
 * @category Docker
 */
export const runScoped: (
    containerOptions: Parameters<Endpoints.Containers["create"]>[0]
) => Effect.Effect<Schemas.ContainerInspectResponse, Endpoints.ContainersError, Scope.Scope | Endpoints.Containers> =
    internal.runScoped;

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search: (
    options: Parameters<Endpoints.Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<Schemas.RegistrySearchResponse>, Endpoints.ImagesError, Endpoints.Images> =
    internal.search;

/**
 * Implements the `docker start` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const start: (containerId: string) => Effect.Effect<void, Endpoints.ContainersError, Endpoints.Containers> =
    internal.start;

/**
 * Implements the `docker stop` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const stop: (containerId: string) => Effect.Effect<void, Endpoints.ContainersError, Endpoints.Containers> =
    internal.stop;

/**
 * Implements the `docker version` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const version: () => Effect.Effect<
    Readonly<Schemas.SystemVersionResponse>,
    Endpoints.SystemsError,
    Endpoints.Systems
> = internal.version;
