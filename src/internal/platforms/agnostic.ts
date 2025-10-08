import type * as MobyConnection from "../../MobyConnection.js";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as internalConnection from "./connection.js";

/** @internal */
export const makeVersionPath = (connectionOptions: MobyConnection.MobyConnectionOptions): string =>
    Predicate.isNotUndefined(connectionOptions.version) ? `/v${connectionOptions.version}` : "";

/** @internal */
export const makeHttpRequestUrl: (connectionOptions: MobyConnection.MobyConnectionOptions) => string =
    internalConnection.MobyConnectionOptions.$match({
        ssh: (options) => `http://0.0.0.0${makeVersionPath(options)}` as const,
        socket: (options) => `http://0.0.0.0${makeVersionPath(options)}` as const,
        http: (options) =>
            `http://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}` as const,
        https: (options) =>
            `https://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}` as const,
    });

/** @internal */
export const makeWebsocketRequestUrl: (connectionOptions: MobyConnection.MobyConnectionOptions) => string =
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
