/**
 * Generic Moby helpers
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context";
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
export type MobyLayerWithoutPlatformLayerConstructor = Layer.Layer<
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
    Layer.Layer.Success<MobyLayerWithoutPlatformLayerConstructor>,
    Layer.Layer.Error<MobyLayerWithoutPlatformLayerConstructor>,
    Layer.Layer.Context<MobyLayerWithoutPlatformLayerConstructor> | HttpClient.HttpClient.Default
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type MobyLayer<E1 = never> = Layer.Layer<
    Layer.Layer.Success<MobyLayerWithoutPlatformLayerConstructor> | MobyLayerConstructor,
    Layer.Layer.Error<MobyLayerWithoutPlatformLayerConstructor> | E1,
    Layer.Layer.Context<MobyLayerWithoutPlatformLayerConstructor>
>;

/**
 * @since 1.0.0
 * @category Tags
 */
export interface MobyLayerConstructor {
    readonly _: unique symbol;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export type MobyLayerConstructorImpl<E1 = never> = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
) => MobyLayer<E1>;

/**
 * @since 1.0.0
 * @category Tags
 */
export const PlatformLayerConstructor = <E1 = never>(): Context.Tag<
    MobyLayerConstructor,
    MobyLayerConstructorImpl<E1>
> =>
    Context.GenericTag<MobyLayerConstructor, MobyLayerConstructorImpl<E1>>(
        "@the-moby-effect/engines/Moby/PlatformLayerConstructor"
    );

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
export const layerNodeJS: MobyLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): MobyLayer => {
    const platformLayerConstructor = PlatformAgents.makeNodeHttpClientLayer;
    const platformHttpLayer = platformLayerConstructor(connectionOptions);
    const platformConstructorLayer = Layer.succeed(PlatformLayerConstructor(), layerNodeJS);
    const outLater = Layer.merge(layerWithoutHttpCLient, platformConstructorLayer);
    return Layer.provide(outLater, platformHttpLayer);
};

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: MobyLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): MobyLayer => {
    const platformLayerConstructor = PlatformAgents.makeBunHttpClientLayer;
    const platformHttpLayer = platformLayerConstructor(connectionOptions);
    const platformConstructorLayer = Layer.succeed(PlatformLayerConstructor(), layerBun);
    const outLater = Layer.merge(layerWithoutHttpCLient, platformConstructorLayer);
    return Layer.provide(outLater, platformHttpLayer);
};

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: MobyLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): MobyLayer => {
    const platformLayerConstructor = PlatformAgents.makeDenoHttpClientLayer;
    const platformHttpLayer = platformLayerConstructor(connectionOptions);
    const platformConstructorLayer = Layer.succeed(PlatformLayerConstructor(), layerDeno);
    const outLater = Layer.merge(layerWithoutHttpCLient, platformConstructorLayer);
    return Layer.provide(outLater, platformHttpLayer);
};

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: MobyLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): MobyLayer => {
    const platformLayerConstructor = PlatformAgents.makeUndiciHttpClientLayer;
    const platformHttpLayer = platformLayerConstructor(connectionOptions);
    const platformConstructorLayer = Layer.succeed(PlatformLayerConstructor(), layerUndici);
    const outLater = Layer.merge(layerWithoutHttpCLient, platformConstructorLayer);
    return Layer.provide(outLater, platformHttpLayer);
};

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: MobyLayerConstructorImpl<ConfigError.ConfigError> = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): MobyLayer<ConfigError.ConfigError> => {
    const platformLayerConstructor = PlatformAgents.makeWebHttpClientLayer;
    const platformHttpLayer = platformLayerConstructor(connectionOptions);
    const platformConstructorLayer = Layer.succeed(PlatformLayerConstructor<ConfigError.ConfigError>(), layerWeb);
    const outLater = Layer.merge(layerWithoutHttpCLient, platformConstructorLayer);
    return Layer.provide(outLater, platformHttpLayer);
};
