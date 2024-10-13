/**
 * Connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Layer from "effect/Layer";

import { HttpClientRequest } from "@effect/platform";
import { MobyConnectionOptions } from "./Connection.js";

// export const transformLayer = (connectionOptions: MobyConnectionOptions) =>
//     Layer.map<
//         HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>,
//         HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
//     >((context) => {
//         const oldClient = Context.get(context, HttpClient.HttpClient);
//         const requestUrl = getRequestUrl(connectionOptions);
//         const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
//         const newContext = Context.make(HttpClient.HttpClient, newClient);
//         return newContext;
//     });

/**
 * @since 1.0.0
 * @category Helpers
 */
export const getRequestUrl: (connectionOptions: MobyConnectionOptions) => string = MobyConnectionOptions.$match({
    ssh: () => "http://0.0.0.0" as const,
    socket: () => "http://0.0.0.0" as const,
    http: (options) => `http://${options.host}:${options.port}${options.path ?? ""}` as const,
    https: (options) => `https://${options.host}:${options.port}${options.path ?? ""}` as const,
});

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance and requires
 * an http client to transform from.
 *
 * @since 1.0.0
 * @category Agnostic
 */
export const makeAgnosticHttpClientLayer = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> =>
    Layer.function(
        HttpClient.HttpClient,
        HttpClient.HttpClient,
        HttpClient.mapRequest(HttpClientRequest.prependUrl(getRequestUrl(connectionOptions)))
    );
