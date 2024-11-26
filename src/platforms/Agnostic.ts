/**
 * Connection agents in a platform agnostic way.
 *
 * @since 1.0.0
 */

import * as assert from "node:assert";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Socket from "@effect/platform/Socket";
import * as UrlParams from "@effect/platform/UrlParams";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import { MobyConnectionOptions } from "../MobyConnection.js";

/**
 * @since 1.0.0
 * @category Helpers
 */
const makeHttpRequestUrl: (connectionOptions: MobyConnectionOptions) => string = MobyConnectionOptions.$match({
    ssh: () => "http://0.0.0.0" as const,
    socket: () => "http://0.0.0.0" as const,
    http: (options) => `http://${options.host}:${options.port}${options.path ?? ""}` as const,
    https: (options) => `https://${options.host}:${options.port}${options.path ?? ""}` as const,
});

/**
 * @since 1.0.0
 * @category Helpers
 */
const makeWebsocketRequestUrl: (connectionOptions: MobyConnectionOptions) => string = MobyConnectionOptions.$match({
    ssh: () => "ws://0.0.0.0" as const,
    socket: (options) => `ws+unix://${options.socketPath}:` as const,
    http: (options) => `ws://${options.host}:${options.port}${options.path ?? ""}` as const,
    https: (options) => `wss://${options.host}:${options.port}${options.path ?? ""}` as const,
});

/** @internal */
const HttpClientMobyConnectionOptions: unique symbol = Symbol.for(
    "@the-moby-effect/platforms/Agnostic/HttpClientMobyConnectionOptions"
);

/** @internal */
interface HttpClientExtension<E = HttpClientError.HttpClientError, R = Scope.Scope>
    extends HttpClient.HttpClient<E, R> {
    readonly [HttpClientMobyConnectionOptions]: MobyConnectionOptions;
}

/** @internal */
export const websocketRequest = (
    request: HttpClientRequest.HttpClientRequest
): Effect.Effect<Socket.Socket, Error, Socket.WebSocketConstructor | HttpClient.HttpClient> =>
    Effect.gen(function* () {
        const client = yield* HttpClient.HttpClient;

        const { hash, url, urlParams } = request;
        const { [HttpClientMobyConnectionOptions]: connectionOptions } = client as HttpClientExtension;
        assert.ok(connectionOptions);

        const websocketUrl = yield* UrlParams.makeUrl(
            `${makeWebsocketRequestUrl(connectionOptions)}${url}`,
            urlParams,
            hash
        );

        return yield* Socket.makeWebSocket(websocketUrl.toString());
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
    Function.pipe(
        Layer.function(
            HttpClient.HttpClient,
            HttpClient.HttpClient,
            HttpClient.mapRequest((request) => {
                const httpUrl = makeHttpRequestUrl(connectionOptions);
                const urlPrepended = HttpClientRequest.prependUrl(request, httpUrl);
                return urlPrepended;
            })
        ),
        Layer.map((context) => {
            const tag: Context.Tag<
                HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>,
                HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
            > = HttpClient.HttpClient;
            const oldClient = Context.get(context, tag);
            type Mutable<T> = { -readonly [P in keyof T]: T[P] };
            (oldClient as Mutable<HttpClientExtension>)[HttpClientMobyConnectionOptions] = connectionOptions;
            return Context.make(tag, oldClient);
        }),
        Layer.tap((context) => {
            const client = Context.get(context, HttpClient.HttpClient);
            const { [HttpClientMobyConnectionOptions]: savedConnectionOptions } = client as HttpClientExtension;
            assert.deepStrictEqual(savedConnectionOptions, connectionOptions);
            return Effect.void;
        })
    );

/**
 * Given the moby connection options, it will construct a layer that provides a
 * websocket constructor that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Agnostic
 */
export const makeAgnosticWebsocketLayer = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor, never, never> =>
    Layer.effect(
        Socket.WebSocketConstructor,
        Effect.gen(function* () {
            if (MobyConnectionOptions.$is("socket")(connectionOptions)) {
                const ws = yield* Effect.promise(() => import("ws"));
                return (url, protocols) => new ws.WebSocket(url, protocols) as unknown as globalThis.WebSocket;
            }
            return (url, protocols) => new WebSocket(url, protocols);
        })
    );

/**
 * @since 1.0.0
 * @category Agnostic
 */
export const makeAgnosticLayer = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor | HttpClient.HttpClient, never, HttpClient.HttpClient> => {
    const httpClientLayer = makeAgnosticHttpClientLayer(connectionOptions);
    const websocketLayer = makeAgnosticWebsocketLayer(connectionOptions);
    return Layer.merge(websocketLayer, httpClientLayer);
};
