/**
 * Http and https connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import { HttpClientRequest } from "@effect/platform";
import { MobyConnectionOptions, getRequestUrl } from "./Common.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. Since this
 * is meant to be platform agnostic and there are some platforms where we can
 * not construct ssh nor socket connections, only http and https are supported.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> =>
    Layer.function(HttpClient.HttpClient, HttpClient.HttpClient, (oldClient) => {
        const requestUrl = getRequestUrl(connectionOptions);
        const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
        return newClient;
    });

export const transformLayer = (connectionOptions: MobyConnectionOptions) =>
    Layer.map<
        HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>,
        HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
    >((context) => {
        const oldClient = Context.get(context, HttpClient.HttpClient);
        const requestUrl = getRequestUrl(connectionOptions);
        const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
        const newContext = Context.make(HttpClient.HttpClient, newClient);
        return newContext;
    });
