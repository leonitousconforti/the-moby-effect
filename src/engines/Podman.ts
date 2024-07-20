/**
 * Podman helpers
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as ConfigError from "effect/ConfigError";
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
 * @category Layer
 */
export type PodmanLayer = Layer.Layer<
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
 * @category Layer
 */
export const layer: Layer.Layer<
    Layer.Layer.Success<PodmanLayer>,
    Layer.Layer.Error<PodmanLayer>,
    Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient.Default
> = Layer.mergeAll(
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
 * @category Layer
 */
export const layerNodeJS: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer = Moby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerBun: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer = Moby.layerBun;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerDeno: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer = Moby.layerDeno;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerUndici: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer = Moby.layerUndici;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerWeb: (
    connectionOptions: PlatformAgents.MobyConnectionOptions
) => Layer.Layer<
    Layer.Layer.Success<PodmanLayer>,
    Layer.Layer.Error<PodmanLayer> | ConfigError.ConfigError,
    Layer.Layer.Context<PodmanLayer>
> = Moby.layerWeb;
