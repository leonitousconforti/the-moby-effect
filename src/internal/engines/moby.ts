/**
 * Generic Moby engine.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Layer from "effect/Layer";

import type {
    HttpConnectionOptionsTagged,
    HttpsConnectionOptionsTagged,
    MobyConnectionOptions,
} from "../../MobyConnection.js";

import { Configs, ConfigsLayer } from "../endpoints/configs.js";
import { Containers, ContainersLayer } from "../endpoints/containers.js";
import { Distributions, DistributionsLayer } from "../endpoints/distribution.js";
import { Execs, ExecsLayer } from "../endpoints/execs.js";
import { Images, ImagesLayer } from "../endpoints/images.js";
import { Networks, NetworksLayer } from "../endpoints/networks.js";
import { Nodes, NodesLayer } from "../endpoints/nodes.js";
import { Plugins, PluginsLayer } from "../endpoints/plugins.js";
import { Secrets, SecretsLayer } from "../endpoints/secrets.js";
import { Services, ServicesLayer } from "../endpoints/services.js";
import { Sessions, SessionsLayer } from "../endpoints/session.js";
import { Swarm, SwarmLayer } from "../endpoints/swarm.js";
import { Systems, SystemsLayer } from "../endpoints/system.js";
import { Tasks, TasksLayer } from "../endpoints/tasks.js";
import { Volumes, VolumesLayer } from "../endpoints/volumes.js";
import { makeAgnosticHttpClientLayer } from "../platforms/agnostic.js";
import { makeBunHttpClientLayer } from "../platforms/bun.js";
import { makeDenoHttpClientLayer } from "../platforms/deno.js";
import { makeFetchHttpClientLayer } from "../platforms/fetch.js";
import { makeNodeHttpClientLayer } from "../platforms/node.js";
import { makeUndiciHttpClientLayer } from "../platforms/undici.js";
import { makeWebHttpClientLayer } from "../platforms/web.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
    | Configs
    | Containers
    | Distributions
    | Execs
    | Images
    | Networks
    | Nodes
    | Plugins
    | Secrets
    | Services
    | Sessions
    | Swarm
    | Systems
    | Tasks
    | Volumes,
    never,
    HttpClient.HttpClient | Socket.WebSocketConstructor
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayer = Layer.Layer<
    Layer.Layer.Success<MobyLayerWithoutHttpClientOrWebsocketConstructor>,
    Layer.Layer.Error<MobyLayerWithoutHttpClientOrWebsocketConstructor>,
    Exclude<
        Layer.Layer.Context<MobyLayerWithoutHttpClientOrWebsocketConstructor>,
        HttpClient.HttpClient | Socket.WebSocketConstructor
    >
>;

/**
 * Merges all the layers into a single layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: MobyLayerWithoutHttpClientOrWebsocketConstructor = Layer.mergeAll(
    ConfigsLayer,
    ContainersLayer,
    DistributionsLayer,
    ExecsLayer,
    ImagesLayer,
    NetworksLayer,
    NodesLayer,
    PluginsLayer,
    SecretsLayer,
    ServicesLayer,
    SessionsLayer,
    SwarmLayer,
    SystemsLayer,
    TasksLayer,
    VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS = (connectionOptions: MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, makeNodeHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun = (connectionOptions: MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, makeBunHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno = (connectionOptions: MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, makeDenoHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici = (connectionOptions: MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, makeUndiciHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb = (connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, makeWebHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerFetch = (connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, makeFetchHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): MobyLayerWithoutHttpClientOrWebsocketConstructor =>
    Layer.provide(layerWithoutHttpCLient, makeAgnosticHttpClientLayer(connectionOptions));
