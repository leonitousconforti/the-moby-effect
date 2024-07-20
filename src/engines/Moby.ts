/**
 * Generic Moby helpers
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as ConfigError from "effect/ConfigError";
import * as Layer from "effect/Layer";

import * as PlatformAgents from "../PlatformAgents.js";
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
 * Merges all the layers into a single layer
 *
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
    | Swarm.Swarms
    | System.Systems
    | Tasks.Tasks
    | Volumes.Volumes,
    never,
    never
>;

/**
 * Merges all the layers into a single layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<
    Layer.Layer.Success<MobyLayer>,
    Layer.Layer.Error<MobyLayer>,
    Layer.Layer.Context<MobyLayer> | HttpClient.HttpClient.Default
> = Layer.mergeAll(
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
 * @category Layer
 */
export const layerNodeJS = (connectionOptions: PlatformAgents.MobyConnectionOptions): MobyLayer =>
    layer.pipe(Layer.provide(PlatformAgents.makeNodeHttpClientLayer(connectionOptions)));

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerBun = (connectionOptions: PlatformAgents.MobyConnectionOptions): MobyLayer =>
    layer.pipe(Layer.provide(PlatformAgents.makeBunHttpClientLayer(connectionOptions)));

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerDeno = (connectionOptions: PlatformAgents.MobyConnectionOptions): MobyLayer =>
    layer.pipe(Layer.provide(PlatformAgents.makeDenoHttpClientLayer(connectionOptions)));

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerUndici = (connectionOptions: PlatformAgents.MobyConnectionOptions): MobyLayer =>
    layer.pipe(Layer.provide(PlatformAgents.makeUndiciHttpClientLayer(connectionOptions)));

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerWeb = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): Layer.Layer<
    Layer.Layer.Success<MobyLayer>,
    Layer.Layer.Error<MobyLayer> | ConfigError.ConfigError,
    Layer.Layer.Context<MobyLayer>
> => layer.pipe(Layer.provide(PlatformAgents.makeBrowserHttpClientLayer(connectionOptions)));
