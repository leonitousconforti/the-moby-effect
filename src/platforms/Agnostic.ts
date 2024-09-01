/**
 * Http and https connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";

import { HttpClientRequest } from "@effect/platform";
import { HttpConnectionOptionsTagged, HttpsConnectionOptionsTagged } from "./Common.js";

/**
 * @since 1.0.0
 * @category Helpers
 */
export const getAgnosticRequestUrl = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): string =>
    `${connectionOptions._tag}://${connectionOptions.host}:${connectionOptions.port}${connectionOptions.path ?? ""}` as const;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged,
    layer: Layer.Layer<HttpClient.HttpClient.Default, never, never>
): Layer.Layer<HttpClient.HttpClient.Default, never, HttpClient.HttpClient.Default> =>
    Layer.map(layer, (context) => {
        const oldClient = Context.get(context, HttpClient.HttpClient);
        const requestUrl = getAgnosticRequestUrl(connectionOptions);
        const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
        const newContext = Context.make(HttpClient.HttpClient, newClient);
        return newContext;
    });
