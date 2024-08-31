/**
 * Podman engine helpers
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Context from "effect/Context";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import * as Platforms from "../Platforms.js";
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
export type PodmanLayer = Layer.Layer<
    Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor> | PodmanLayerConstructor,
    Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor>,
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
export type PodmanLayerConstructorImpl<A = Platforms.MobyConnectionOptions> = (connectionOptions: A) => PodmanLayer;

/**
 * @since 1.0.0
 * @category Tags
 */
export const PlatformLayerConstructor = <A = Platforms.MobyConnectionOptions>(): Context.Tag<
    PodmanLayerConstructor,
    PodmanLayerConstructorImpl<A>
> =>
    Context.GenericTag<PodmanLayerConstructor, PodmanLayerConstructorImpl<A>>(
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
    connectionOptions: Platforms.MobyConnectionOptions
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
export const layerBun: PodmanLayerConstructorImpl = (connectionOptions: Platforms.MobyConnectionOptions): PodmanLayer =>
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
    connectionOptions: Platforms.MobyConnectionOptions
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
    connectionOptions: Platforms.MobyConnectionOptions
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
export const layerWeb: PodmanLayerConstructorImpl<
    Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
> = (connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged): PodmanLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerWeb,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(
            Context.add(
                PlatformLayerConstructor<
                    Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
                >(),
                layerWeb
            )
        )
    );
