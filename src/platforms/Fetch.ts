/**
 * Http and https connection methods for fetch.
 *
 * @since 1.0.0
 */

import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as HttpClient from "@effect/platform/HttpClient";
import * as Layer from "effect/Layer";

import { HttpConnectionOptionsTagged, HttpsConnectionOptionsTagged } from "../Connection.js";
import { makeAgnosticHttpClientLayer } from "./Agnostic.js";

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
): Layer.Layer<HttpClient.HttpClient, never, never> =>
    Layer.provide(makeAgnosticHttpClientLayer(connectionOptions), FetchHttpClient.layer);
