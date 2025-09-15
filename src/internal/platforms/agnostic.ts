import type * as MobyConnection from "../../MobyConnection.js";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
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
export const makeAgnosticHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> =>
    Layer.function(
        HttpClient.HttpClient,
        HttpClient.HttpClient,
        HttpClient.mapRequest((request) => {
            const httpUrl = makeHttpRequestUrl(connectionOptions);
            const urlPrepended = HttpClientRequest.prependUrl(request, httpUrl);
            return urlPrepended;
        })
    );

/** @internal */
export const makeAgnosticWebsocketLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor, never, never> =>
    Layer.effect(
        Socket.WebSocketConstructor,
        Effect.gen(function* () {
            const prependedUrl = makeWebsocketRequestUrl(connectionOptions);

            // Only the ws package supports unix socket connection options
            if (internalConnection.MobyConnectionOptions.$is("socket")(connectionOptions)) {
                const ws = yield* Effect.promise(() => import("ws"));
                return (url, protocols) =>
                    new ws.WebSocket(`${prependedUrl}${url}`, protocols) as unknown as globalThis.WebSocket;
            }
            return (url, protocols) => new WebSocket(`${prependedUrl}${url}`, protocols);
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
