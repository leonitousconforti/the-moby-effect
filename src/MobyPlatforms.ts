/**
 * Http client layers for all platforms.
 *
 * @since 1.0.0
 */

import type * as Layer from "effect/Layer";
import type * as HttpClient from "effect/unstable/http/HttpClient";
import type * as Socket from "effect/unstable/socket/Socket";

import type * as MobyConnection from "./MobyConnection.ts";

import * as internalAgnostic from "./internal/platforms/agnostic.ts";
import * as internalBun from "./internal/platforms/bun.ts";
import * as internalDeno from "./internal/platforms/deno.ts";
import * as internalFetch from "./internal/platforms/fetch.ts";
import * as internalNode from "./internal/platforms/node.ts";
import * as internalUndici from "./internal/platforms/undici.ts";
import * as internalWeb from "./internal/platforms/web.ts";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> = internalAgnostic.makeAgnosticHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. Built on
 * Bun's native fetch: unix socket connections use Bun's `unix` fetch option
 * and https connections pass their certificate material through Bun's `tls`
 * fetch option. Ssh connections fall back to the node http layer, which Bun
 * implements natively.
 *
 * Note that exec and attach endpoints hijack the underlying socket of the
 * http connection, which fetch based clients can not expose - use the
 * websocket based alternatives on this layer.
 *
 * @since 1.0.0
 * @category Bun
 */
export const makeBunHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalBun.makeBunHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. Built on
 * Deno's native fetch: unix socket connections and custom https certificate
 * material use `Deno.createHttpClient`, which is passed to fetch through
 * Deno's `client` fetch option. Ssh connections fall back to the node http
 * layer, which Deno implements in its node compat layer.
 *
 * Note that exec and attach endpoints hijack the underlying socket of the
 * http connection, which fetch based clients can not expose - use the
 * websocket based alternatives on this layer.
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
