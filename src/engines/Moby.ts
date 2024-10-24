/**
 * Generic Moby engine.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Layer from "effect/Layer";

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
import * as Connection from "../MobyConnection.js";
import * as Platforms from "../MobyPlatforms.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayerWithoutHttpClient = Layer.Layer<
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
    HttpClient.HttpClient
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayer = Layer.Layer<
    Layer.Layer.Success<MobyLayerWithoutHttpClient>,
    Layer.Layer.Error<MobyLayerWithoutHttpClient>,
    Exclude<Layer.Layer.Context<MobyLayerWithoutHttpClient>, HttpClient.HttpClient>
>;

/**
 * Merges all the layers into a single layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: MobyLayerWithoutHttpClient = Layer.mergeAll(
    Configs.ConfigsLayer,
    Containers.ContainersLayer,
    Distributions.DistributionsLayer,
    Execs.ExecsLayer,
    Images.ImagesLayer,
    Networks.NetworksLayer,
    Nodes.NodesLayer,
    Plugins.PluginsLayer,
    Secrets.SecretsLayer,
    Services.ServicesLayer,
    Sessions.SessionsLayer,
    Swarm.SwarmLayer,
    System.SystemsLayer,
    Tasks.TasksLayer,
    Volumes.VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS = (connectionOptions: Connection.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeNodeHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun = (connectionOptions: Connection.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeBunHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno = (connectionOptions: Connection.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeDenoHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici = (connectionOptions: Connection.MobyConnectionOptions): MobyLayer =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeUndiciHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb = (
    connectionOptions: Connection.HttpConnectionOptionsTagged | Connection.HttpsConnectionOptionsTagged
): MobyLayer => Layer.provide(layerWithoutHttpCLient, Platforms.makeWebHttpClientLayer(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic = (
    connectionOptions: Connection.HttpConnectionOptionsTagged | Connection.HttpsConnectionOptionsTagged
): MobyLayerWithoutHttpClient =>
    Layer.provide(layerWithoutHttpCLient, Platforms.makeAgnosticHttpClientLayer(connectionOptions));
