/**
 * Generic Moby engine
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Layer from "effect/Layer";

import * as Platforms from "../Platforms.js";
import * as Configs from "../endpoints/Configs.js";
import * as Containers from "../endpoints/Containers.js";
import * as Distributions from "../endpoints/Distribution.js";
import * as Execs from "../endpoints/Execs.js";
import * as Images from "../endpoints/Images.js";
import * as Networks from "../endpoints/Networks.js";
import * as Nodes from "../endpoints/Nodes.js";
import * as Plugins from "../endpoints/Plugins.js";
import * as Secrets from "../endpoints/Secrets.js";
import * as Services from "../endpoints/Services.js";
import * as Sessions from "../endpoints/Session.js";
import * as Swarm from "../endpoints/Swarm.js";
import * as System from "../endpoints/System.js";
import * as Tasks from "../endpoints/Tasks.js";
import * as Volumes from "../endpoints/Volumes.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayer = Layer.Layer<
    | Configs.Configs
    | Containers.Containers
    | Distributions.Distributions
    | Execs.Execs
    | Images.Images
    | Networks.Networks
    | Nodes.Nodes
    | Plugins.Plugins
    | Secrets.Secrets
    | Services.Services
    | Sessions.Sessions
    | Swarm.Swarm
    | System.Systems
    | Tasks.Tasks
    | Volumes.Volumes,
    never,
    never
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayerWithoutHttpClient = Layer.Layer<
    Layer.Layer.Success<MobyLayer>,
    Layer.Layer.Error<MobyLayer>,
    Layer.Layer.Context<MobyLayer> | HttpClient.HttpClient.Default
>;

/**
 * Merges all the layers into a single layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: MobyLayerWithoutHttpClient = Layer.mergeAll(
    Configs.layer,
    Containers.layer,
    Distributions.layer,
    Execs.layer,
    Images.layer,
    Networks.layer,
    Nodes.layer,
    Plugins.layer,
    Secrets.layer,
    Services.layer,
    Sessions.layer,
    Swarm.layer,
    System.layer,
    Tasks.layer,
    Volumes.layer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS = (connectionOptions: Platforms.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeNodeHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun = (connectionOptions: Platforms.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeBunHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno = (connectionOptions: Platforms.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeDenoHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici = (connectionOptions: Platforms.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeUndiciHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb = (
    connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
): MobyLayer => Layer.provide(layerWithoutHttpCLient, Platforms.makeWebHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic = (
    connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
): MobyLayerWithoutHttpClient =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeAgnosticHttpClientLayer(connectionOptions));
