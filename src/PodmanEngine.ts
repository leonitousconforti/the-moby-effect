/**
 * Podman engine
 *
 * @since 1.0.0
 */

import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Socket from "@effect/platform/Socket";

import * as Layer from "effect/Layer";
import * as internalMoby from "./internal/engines/moby.js";
import * as MobyConnection from "./MobyConnection.js";
import * as Endpoints from "./MobyEndpoints.js";

/**
 * @since 1.0.0
 * @category Types
 */
export type PodmanLayer = Layer.Layer<
    | Endpoints.Containers
    | Endpoints.Execs
    | Endpoints.Images
    | Endpoints.Networks
    | Endpoints.Secrets
    | Endpoints.Systems
    | Endpoints.Volumes,
    never,
    never
>;

/**
 * @since 1.0.0
 * @category Types
 */
export type PodmanLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
    Layer.Layer.Success<PodmanLayer>,
    Layer.Layer.Error<PodmanLayer>,
    Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: PodmanLayerWithoutHttpClientOrWebsocketConstructor = Layer.mergeAll(
    Endpoints.ContainersLayer,
    Endpoints.ExecsLayer,
    Endpoints.ImagesLayer,
    Endpoints.NetworksLayer,
    Endpoints.SecretsLayer,
    Endpoints.SystemsLayer,
    Endpoints.VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer =
    internalMoby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer = internalMoby.layerBun;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer =
    internalMoby.layerDeno;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer =
    internalMoby.layerUndici;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer = internalMoby.layerWeb;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer = internalMoby.layerFetch;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpClientOrWebsocketConstructor = internalMoby.layerAgnostic;
