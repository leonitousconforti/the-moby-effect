/**
 * Podman engine
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Layer from "effect/Layer";

import * as Platforms from "../MobyConnection.js";
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
 * @category Layers
 */
export type PodmanLayerWithoutHttpCLient = Layer.Layer<
    Layer.Layer.Success<PodmanLayer>,
    Layer.Layer.Error<PodmanLayer>,
    Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient
>;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: PodmanLayerWithoutHttpCLient = Layer.mergeAll(
    Containers.ContainersLayer,
    Execs.ExecsLayer,
    Images.ImagesLayer,
    Networks.NetworksLayer,
    Secrets.SecretsLayer,
    System.SystemsLayer,
    Volumes.VolumesLayer
);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer = Moby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer = Moby.layerBun;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer = Moby.layerDeno;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer = Moby.layerUndici;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (
    connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
) => PodmanLayer = Moby.layerWeb;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpCLient = Moby.layerAgnostic;
