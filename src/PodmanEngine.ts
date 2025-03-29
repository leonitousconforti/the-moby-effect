/**
 * Podman engine
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Layer from "effect/Layer";
import * as Moby from "./internal/engines/moby.js";

import type {
    HttpConnectionOptionsTagged,
    HttpsConnectionOptionsTagged,
    MobyConnectionOptions,
} from "./MobyConnection.js";

import { Containers, ContainersLayer } from "./internal/endpoints/containers.js";
import { Execs, ExecsLayer } from "./internal/endpoints/execs.js";
import { Images, ImagesLayer } from "./internal/endpoints/images.js";
import { Networks, NetworksLayer } from "./internal/endpoints/networks.js";
import { Secrets, SecretsLayer } from "./internal/endpoints/secrets.js";
import { Systems, SystemsLayer } from "./internal/endpoints/system.js";
import { Volumes, VolumesLayer } from "./internal/endpoints/volumes.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type PodmanLayer = Layer.Layer<
    Containers | Execs | Images | Networks | Secrets | Systems | Volumes,
    never,
    never
>;

/**
 * @since 1.0.0
 * @category Layers
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
    ContainersLayer,
    ExecsLayer,
    ImagesLayer,
    NetworksLayer,
    SecretsLayer,
    SystemsLayer,
    VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: (connectionOptions: MobyConnectionOptions) => PodmanLayer = Moby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: MobyConnectionOptions) => PodmanLayer = Moby.layerBun;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: MobyConnectionOptions) => PodmanLayer = Moby.layerDeno;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: MobyConnectionOptions) => PodmanLayer = Moby.layerUndici;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged) => PodmanLayer =
    Moby.layerWeb;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => PodmanLayer = Moby.layerFetch;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpClientOrWebsocketConstructor = Moby.layerAgnostic;
