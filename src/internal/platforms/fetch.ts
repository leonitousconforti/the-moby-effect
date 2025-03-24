/**
 * Http and https connection methods for fetch.
 *
 * @since 1.0.0
 */

import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as HttpClient from "@effect/platform/HttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Layer from "effect/Layer";

import { makeAgnosticLayer } from "./agnostic.js";
import { HttpConnectionOptionsTagged, HttpsConnectionOptionsTagged } from "./connection.js";

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
export const makeFetchHttpClientLayer = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =>
    Layer.provide(makeAgnosticLayer(connectionOptions), FetchHttpClient.layer);
