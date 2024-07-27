/**
 * Podman engine helpers
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import * as PlatformAgents from "../PlatformAgents.js";
import * as Containers from "../endpoints/Containers.js";
import * as Execs from "../endpoints/Execs.js";
import * as Images from "../endpoints/Images.js";
import * as Networks from "../endpoints/Networks.js";
import * as Secrets from "../endpoints/Secrets.js";
import * as System from "../endpoints/System.js";
import * as Volumes from "../endpoints/Volumes.js";
import * as Moby from "./Moby.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type PodmanLayerWithoutPlatformLayerConstructor = Layer.Layer<
    | Containers.Containers
    | Execs.Execs
    | Images.Images
    | Networks.Networks
    | Secrets.Secrets
    | System.Systems
    | Volumes.Volumes,
    never,
    never
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type PodmanLayerWithoutHttpCLient = Layer.Layer<
    Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor>,
    Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor>,
    Layer.Layer.Context<PodmanLayerWithoutPlatformLayerConstructor> | HttpClient.HttpClient.Default
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export type PodmanLayer<E1 = never> = Layer.Layer<
    Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor> | PodmanLayerConstructor,
    Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor> | E1,
    Layer.Layer.Context<PodmanLayerWithoutPlatformLayerConstructor>
>;

/**
 * @since 1.0.0
 * @category Tags
 */
export interface PodmanLayerConstructor {
    readonly _: unique symbol;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export type PodmanLayerConstructorImpl<E1 = never> = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
) => PodmanLayer<E1>;

/**
 * @since 1.0.0
 * @category Tags
 */
export const PlatformLayerConstructor = <E1 = never>(): Context.Tag<
    PodmanLayerConstructor,
    PodmanLayerConstructorImpl<E1>
> =>
    Context.GenericTag<PodmanLayerConstructor, PodmanLayerConstructorImpl<E1>>(
        "@the-moby-effect/engines/Podman/PlatformLayerConstructor"
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: PodmanLayerWithoutHttpCLient = Layer.mergeAll(
    Containers.layer,
    Execs.layer,
    Images.layer,
    Networks.layer,
    Secrets.layer,
    System.layer,
    Volumes.layer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: PodmanLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): PodmanLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerNodeJS,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerNodeJS))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: PodmanLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): PodmanLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerBun,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerBun))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: PodmanLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): PodmanLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerDeno,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerDeno))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: PodmanLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): PodmanLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerUndici,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerUndici))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: PodmanLayerConstructorImpl<ConfigError.ConfigError> = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): PodmanLayer<ConfigError.ConfigError> =>
    Function.pipe(
        connectionOptions,
        Moby.layerWeb,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor<ConfigError.ConfigError>())),
        Layer.map(Context.add(PlatformLayerConstructor<ConfigError.ConfigError>(), layerWeb))
    );
