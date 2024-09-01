/**
 * Http and https connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Context from "effect/Context";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import { HttpClientRequest } from "@effect/platform";
import { HttpConnectionOptionsTagged, HttpsConnectionOptionsTagged, getAgnosticRequestUrl } from "./Common.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer = Function.dual<
    <Ein, Rin>(
        connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
    ) => (
        layer: Layer.Layer<HttpClient.HttpClient.Default, Ein, Rin>
    ) => Layer.Layer<HttpClient.HttpClient.Default, Ein, Rin>,
    <Ein, Rin>(
        connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged,
        layer: Layer.Layer<HttpClient.HttpClient.Default, Ein, Rin>
    ) => Layer.Layer<HttpClient.HttpClient.Default, Ein, Rin>
>(
    2,
    <Ein, Rin>(
        connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged,
        layer: Layer.Layer<HttpClient.HttpClient.Default, Ein, Rin>
    ): Layer.Layer<HttpClient.HttpClient.Default, Ein, Rin> =>
        Layer.map<HttpClient.HttpClient.Default, HttpClient.HttpClient.Default>((context) => {
            const oldClient = Context.get(context, HttpClient.HttpClient);
            const requestUrl = getAgnosticRequestUrl(connectionOptions);
            const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
            const newContext = Context.make(HttpClient.HttpClient, newClient);
            return newContext;
        })(layer)
);
