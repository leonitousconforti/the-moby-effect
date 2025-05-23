/**
 * Podman engine
 *
 * @since 1.0.0
 */

import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Socket from "@effect/platform/Socket";
import type * as MobyConnection from "./MobyConnection.js";

import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as MobyEndpoints from "./MobyEndpoints.js";
import * as MobyPlatforms from "./MobyPlatforms.js";

/**
 * @since 1.0.0
 * @category Types
 */
export type PodmanLayer = Layer.Layer<
    | MobyEndpoints.Containers
    | MobyEndpoints.Execs
    | MobyEndpoints.Images
    | MobyEndpoints.Networks
    | MobyEndpoints.Secrets
    | MobyEndpoints.Systems
    | MobyEndpoints.Volumes,
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
    MobyEndpoints.ContainersLayer,
    MobyEndpoints.ExecsLayer,
    MobyEndpoints.ImagesLayer,
    MobyEndpoints.NetworksLayer,
    MobyEndpoints.SecretsLayer,
    MobyEndpoints.SystemsLayer,
    MobyEndpoints.VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer = Function.compose(
    MobyPlatforms.makeNodeHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer = Function.compose(
    MobyPlatforms.makeBunHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer = Function.compose(
    MobyPlatforms.makeDenoHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer = Function.compose(
    MobyPlatforms.makeUndiciHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer = Function.compose(MobyPlatforms.makeWebHttpClientLayer, (httpClientLayer) =>
    Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer = Function.compose(MobyPlatforms.makeFetchHttpClientLayer, (httpClientLayer) =>
    Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpClientOrWebsocketConstructor = Function.compose(
    MobyPlatforms.makeAgnosticHttpClientLayer,
    (httpClientLayer) => Layer.provide(layerWithoutHttpCLient, httpClientLayer)
);
