import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Types from "effect/Types";
import type * as MobyConnection from "../../MobyConnection.js";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Socket from "@effect/platform/Socket";
import * as UrlParams from "@effect/platform/UrlParams";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as internalConnection from "./connection.js";

/** @internal */
const makeVersionPath = (connectionOptions: MobyConnection.MobyConnectionOptions): string =>
    Predicate.isNotUndefined(connectionOptions.version) ? `/v${connectionOptions.version}` : "";

/** @internal */
const makeHttpRequestUrl: (connectionOptions: MobyConnection.MobyConnectionOptions) => string =
    internalConnection.MobyConnectionOptions.$match({
        ssh: (options) => `http://0.0.0.0${makeVersionPath(options)}` as const,
        socket: (options) => `http://0.0.0.0${makeVersionPath(options)}` as const,
        http: (options) =>
            `http://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}` as const,
        https: (options) =>
            `https://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}` as const,
    });

/** @internal */
const makeWebsocketRequestUrl: (connectionOptions: MobyConnection.MobyConnectionOptions) => string =
    internalConnection.MobyConnectionOptions.$match({
        ssh: (options) => `ws://0.0.0.0${makeVersionPath(options)}` as const,
        socket: (options) => `ws+unix://${options.socketPath}${makeVersionPath(options)}:` as const,
        http: (options) =>
            `ws://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}` as const,
        https: (options) =>
            `wss://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}` as const,
    });

/** @internal */
const HttpClientMobyConnectionOptions: unique symbol = Symbol.for(
    "@the-moby-effect/platforms/Agnostic/HttpClientMobyConnectionOptions"
);

/** @internal */
interface HttpClientExtension<E = HttpClientError.HttpClientError, R = never> extends HttpClient.HttpClient.With<E, R> {
    readonly [HttpClientMobyConnectionOptions]: MobyConnection.MobyConnectionOptions;
}

/** @internal */
export const websocketRequest = (
    request: HttpClientRequest.HttpClientRequest
): Effect.Effect<Socket.Socket, Error, Socket.WebSocketConstructor | HttpClient.HttpClient> =>
    Effect.gen(function* () {
        const client = yield* HttpClient.HttpClient;

        const { hash, url, urlParams } = request;
        const { [HttpClientMobyConnectionOptions]: connectionOptions } = client as HttpClientExtension;
        if (Predicate.isUndefined(connectionOptions)) {
            return yield* Effect.dieMessage("What happened to the connection options?");
        }

        const websocketUrl = yield* UrlParams.makeUrl(
            `${makeWebsocketRequestUrl(connectionOptions)}${url}`,
            urlParams,
            hash
        );

        return yield* Socket.makeWebSocket(websocketUrl.toString());
    });

/** @internal */
export const makeAgnosticHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
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
            const tag = HttpClient.HttpClient;
            const oldClient = Context.get(context, tag);
            (oldClient as Types.Mutable<HttpClientExtension>)[HttpClientMobyConnectionOptions] = connectionOptions;
            return Context.make(tag, oldClient);
        })
    );

/** @internal */
export const makeAgnosticWebsocketLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor, never, never> =>
    Layer.effect(
        Socket.WebSocketConstructor,
        Effect.gen(function* () {
            // Only the ws package supports unix socket connection options
            if (internalConnection.MobyConnectionOptions.$is("socket")(connectionOptions)) {
                const ws = yield* Effect.promise(() => import("ws"));
                return (url, protocols) => new ws.WebSocket(url, protocols) as unknown as globalThis.WebSocket;
            }
            return (url, protocols) => new WebSocket(url, protocols);
        })
    );

/** @internal */
export const makeAgnosticLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor | HttpClient.HttpClient, never, HttpClient.HttpClient> => {
    const httpClientLayer = makeAgnosticHttpClientLayer(connectionOptions);
    const websocketLayer = makeAgnosticWebsocketLayer(connectionOptions);
    return Layer.merge(websocketLayer, httpClientLayer);
};
