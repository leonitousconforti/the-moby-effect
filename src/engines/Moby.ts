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
} from "../MobyConnection.js";

import { Configs, ConfigsLayer } from "../endpoints/Configs.js";
import { Containers, ContainersLayer } from "../endpoints/Containers.js";
import { Distributions, DistributionsLayer } from "../endpoints/Distribution.js";
import { Execs, ExecsLayer } from "../endpoints/Execs.js";
import { Images, ImagesLayer } from "../endpoints/Images.js";
import { Networks, NetworksLayer } from "../endpoints/Networks.js";
import { Nodes, NodesLayer } from "../endpoints/Nodes.js";
import { Plugins, PluginsLayer } from "../endpoints/Plugins.js";
import { Secrets, SecretsLayer } from "../endpoints/Secrets.js";
import { Services, ServicesLayer } from "../endpoints/Services.js";
import { Sessions, SessionsLayer } from "../endpoints/Session.js";
import { Swarm, SwarmLayer } from "../endpoints/Swarm.js";
import { Systems, SystemsLayer } from "../endpoints/System.js";
import { Tasks, TasksLayer } from "../endpoints/Tasks.js";
import { Volumes, VolumesLayer } from "../endpoints/Volumes.js";
import { makeAgnosticHttpClientLayer } from "../platforms/Agnostic.js";
import { makeBunHttpClientLayer } from "../platforms/Bun.js";
import { makeDenoHttpClientLayer } from "../platforms/Deno.js";
import { makeFetchHttpClientLayer } from "../platforms/Fetch.js";
import { makeNodeHttpClientLayer } from "../platforms/Node.js";
import { makeUndiciHttpClientLayer } from "../platforms/Undici.js";
import { makeWebHttpClientLayer } from "../platforms/Web.js";

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
