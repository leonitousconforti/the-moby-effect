/**
 * Docker in docker engine.
 *
 * @since 1.0.0
 */

import type * as PlatformError from "@effect/platform/Error";
import type * as FileSystem from "@effect/platform/FileSystem";
import type * as Path from "@effect/platform/Path";
import type * as Layer from "effect/Layer";
import type * as ParseResult from "effect/ParseResult";
import type * as BlobConstants from "./internal/blobs/constants.ts";
import type * as MobyConnection from "./MobyConnection.ts";

import * as DockerEngine from "./DockerEngine.ts";
import * as internal from "./internal/engines/dind.ts";

/**
 * @since 1.0.0
 * @category Layers
 */
export type MakeDindLayerFromPlatformConstructor<
    PlatformLayerConstructor extends (
        connectionOptions: any
    ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
    SupportedConnectionOptions extends MobyConnection.MobyConnectionOptions = PlatformLayerConstructor extends (
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
    | DockerEngine.DockerError
    | ParseResult.ParseError
    | PlatformLayerConstructorError
    | (ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never),
    | PlatformLayerConstructorContext
    | (ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never)
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerNodeJS> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerNodeJS);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerBun> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerBun);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerDeno> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerDeno);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerUndici> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerUndici);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerWeb> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerWeb);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerFetch> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerFetch);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: MakeDindLayerFromPlatformConstructor<typeof DockerEngine.layerAgnostic> =
    internal.makeDindLayerFromPlatformConstructor(DockerEngine.layerAgnostic);
