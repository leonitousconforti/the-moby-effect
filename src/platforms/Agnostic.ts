/**
 * Connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as UrlParams from "@effect/platform/UrlParams";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import { MobyConnectionOptions } from "../MobyConnection.js";

/** @internal */
export const HttpClientRequestHttpUrl: unique symbol = Symbol.for(
    "@the-moby-effect/platforms/Agnostic/HttpClientRequestHttpUrl"
);

/** @internal */
export const HttpClientRequestWebsocketUrl: unique symbol = Symbol.for(
    "@the-moby-effect/platforms/Agnostic/HttpClientRequestWebsocketUrl"
);

/**
 * FIXME: this feels very hacky, and is currently only used in one spot where we
 * get very desperate, can we do better?
 *
 * @since 1.0.0
 * @category Types
 */
export interface HttpClientRequestExtension extends HttpClientRequest.HttpClientRequest {
    readonly [HttpClientRequestHttpUrl]: string;
    readonly [HttpClientRequestWebsocketUrl]: string;
}

/**
 * FIXME: this feels very hacky, and is currently only used in one spot where we
 * get very desperate, can we do better?
 *
 * @since 1.0.0
 * @category Types
 */
export const getWebsocketUrl = Function.dual<
    (
        client: HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
    ) => (request: HttpClientRequest.HttpClientRequest) => Effect.Effect<string, Error, never>,
    (
        request: HttpClientRequest.HttpClientRequest,
        client: HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
    ) => Effect.Effect<string, Error, never>
>(
    2,
    (
        request: HttpClientRequest.HttpClientRequest,
        client: HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
    ): Effect.Effect<string, Error, never> => {
        const preprocess = (
            client as HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope> & {
                preprocess: (request: HttpClientRequest.HttpClientRequest) => Effect.Effect<HttpClientRequestExtension>;
            }
        ).preprocess;

        return Function.pipe(
            preprocess(request),
            Effect.flatMap(
                ({
                    hash,
                    url,
                    urlParams,
                    [HttpClientRequestHttpUrl]: httpUrl,
                    [HttpClientRequestWebsocketUrl]: websocketUrl,
                }) => UrlParams.makeUrl(`${url.replace(httpUrl, websocketUrl)}`, urlParams, hash)
            ),
            Effect.map((url) => url.toString())
        );
    }
);

/**
 * @since 1.0.0
 * @category Helpers
 */
export const makeHttpRequestUrl: (connectionOptions: MobyConnectionOptions) => string = MobyConnectionOptions.$match({
    ssh: () => "http://0.0.0.0" as const,
    socket: () => "http://0.0.0.0" as const,
    http: (options) => `http://${options.host}:${options.port}${options.path ?? ""}` as const,
    https: (options) => `https://${options.host}:${options.port}${options.path ?? ""}` as const,
});

/**
 * @since 1.0.0
 * @category Helpers
 */
export const makeWebsocketRequestUrl: (connectionOptions: MobyConnectionOptions) => string =
    MobyConnectionOptions.$match({
        ssh: () => "ws://0.0.0.0" as const,
        socket: (options) => `ws+unix://${options.socketPath}:` as const,
        http: (options) => `ws://${options.host}:${options.port}${options.path ?? ""}` as const,
        https: (options) => `wss://${options.host}:${options.port}${options.path ?? ""}` as const,
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
        HttpClient.mapRequest((request) => {
            const httpUrl = makeHttpRequestUrl(connectionOptions);
            const websocketUrl = makeWebsocketRequestUrl(connectionOptions);
            const urlPrepended = HttpClientRequest.prependUrl(request, httpUrl);
            return {
                ...urlPrepended,
                [HttpClientRequestHttpUrl]: httpUrl,
                [HttpClientRequestWebsocketUrl]: websocketUrl,
            } satisfies HttpClientRequestExtension;
        })
    );
