/**
 * Http and https connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
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
export const makeAgnosticHttpClientLayer = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient.Service, never, HttpClient.HttpClient.Service> =>
    Layer.function(HttpClient.HttpClient, HttpClient.HttpClient, (oldClient) => {
        const requestUrl = getAgnosticRequestUrl(connectionOptions);
        const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
        return newClient;
    });
