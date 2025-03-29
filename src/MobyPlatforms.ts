/**
 * Http client layers for all platforms.
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
} from "./MobyConnection.js";

import * as agnosticInternal from "./internal/platforms/agnostic.js";
import * as bunInternal from "./internal/platforms/bun.js";
import * as denoInternal from "./internal/platforms/deno.js";
import * as nodeInternal from "./internal/platforms/node.js";
import * as undiciInternal from "./internal/platforms/undici.js";
import * as webInternal from "./internal/platforms/web.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> = agnosticInternal.makeAgnosticHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBunHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    bunInternal.makeBunHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeDenoHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    denoInternal.makeDenoHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeNodeHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    nodeInternal.makeNodeHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeUndiciHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    undiciInternal.makeUndiciHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeWebHttpClientLayer: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    webInternal.makeWebHttpClientLayer;
