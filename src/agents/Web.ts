/**
 * Http and https connection methods for the web.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import * as AgentCommon from "./Common.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBrowserHttpClientLayer = (
    connectionOptions: AgentCommon.HttpConnectionOptionsTagged | AgentCommon.HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient.Default, never, never> =>
    Function.pipe(
        Effect.promise(() => import("@effect/platform-browser/BrowserHttpClient")),
        Effect.map((browserHttpClientLazy) => browserHttpClientLazy.layerXMLHttpRequest),
        Layer.unwrapEffect,
        Layer.map((context) => {
            const oldClient = Context.get(context, HttpClient.HttpClient);
            const requestUrl = AgentCommon.getWebRequestUrl(connectionOptions);
            const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
            const newContext = Context.make(HttpClient.HttpClient, newClient);
            return newContext;
        })
    );
