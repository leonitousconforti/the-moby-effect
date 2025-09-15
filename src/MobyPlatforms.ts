/**
 * Http client layers for all platforms.
 *
 * @since 1.0.0
 */

import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Socket from "@effect/platform/Socket";
import type * as MobyConnection from "./MobyConnection.js";

import type * as Layer from "effect/Layer";
import * as internalAgnostic from "./internal/platforms/agnostic.js";
import * as internalBun from "./internal/platforms/bun.js";
import * as internalDeno from "./internal/platforms/deno.js";
import * as internalFetch from "./internal/platforms/fetch.js";
import * as internalNode from "./internal/platforms/node.js";
import * as internalUndici from "./internal/platforms/undici.js";
import * as internalWeb from "./internal/platforms/web.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<Socket.WebSocketConstructor | HttpClient.HttpClient, never, HttpClient.HttpClient> =
    internalAgnostic.makeAgnosticLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * This function will dynamically import the `@effect/platform-node` package.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBunHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalBun.makeBunHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * This function will dynamically import the `@effect/platform-node` package.
 *
 * FIXME: https://github.com/denoland/deno/issues/21436?
 *
 * @since 1.0.0
 * @category Deno
 */
export const makeDenoHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalDeno.makeDenoHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. By only
 * supporting http and https connection options, this function does not rely on
 * any specific platform package and uses the `@effect/platform/FetchHttpClient`
 * as its base http layer.
 *
 * @since 1.0.0
 * @category Fetch
 */
export const makeFetchHttpClientLayer: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalFetch.makeFetchHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * This function will dynamically import the `@effect/platform-node` package.
 *
 * @since 1.0.0
 * @category NodeJS
 */
export const makeNodeHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalNode.makeNodeHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * This function will dynamically import the `@effect/platform-node` and
 * `undici` packages.
 *
 * @since 1.0.0
 * @category Undici
 */
export const makeUndiciHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalUndici.makeUndiciHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * This function will dynamically import the `@effect/platform-browser` package.
 *
 * @since 1.0.0
 * @category Browser
 */
export const makeWebHttpClientLayer: (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalWeb.makeWebHttpClientLayer;
