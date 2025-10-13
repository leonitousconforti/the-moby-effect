import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as MobyConnection from "../../MobyConnection.js";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as internalConnection from "./connection.js";

/** @internal */
export const makeVersionPath = (connectionOptions: MobyConnection.MobyConnectionOptions): string =>
    Predicate.isNotUndefined(connectionOptions.version) ? `/v${connectionOptions.version}` : "";

/** @internal */
export const makeHttpRequestUrl: (connectionOptions: MobyConnection.MobyConnectionOptions) => string =
    internalConnection.MobyConnectionOptions.$match({
        ssh: (options) => `http://0.0.0.0${makeVersionPath(options)}`,
        socket: (options) => `http://0.0.0.0${makeVersionPath(options)}`,
        http: (options) => `http://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}`,
        https: (options) => `https://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}`,
    });

/** @internal */
export const makeWebsocketRequestUrl: (connectionOptions: MobyConnection.MobyConnectionOptions) => string =
    internalConnection.MobyConnectionOptions.$match({
        ssh: (options) => `ws://0.0.0.0${makeVersionPath(options)}`,
        socket: (options) => `ws+unix://${options.socketPath}${makeVersionPath(options)}:`,
        http: (options) => `ws://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}`,
        https: (options) => `wss://${options.host}:${options.port}${options.path ?? ""}${makeVersionPath(options)}`,
    });

/** @internal */
export const makeAgnosticHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> =>
    Layer.function(
        HttpClient.HttpClient,
        HttpClient.HttpClient,
        Function.flow(
            HttpClient.mapRequest((request) => {
                const httpUrl = makeHttpRequestUrl(connectionOptions);
                const urlPrepended = HttpClientRequest.prependUrl(request, httpUrl);
                return urlPrepended;
            }),
            HttpClient.transformResponse(
                Effect.map((response) => {
                    const handler: ProxyHandler<HttpClientResponse.HttpClientResponse> = {
                        get: (target, prop, receiver) => {
                            const replacer = (str: string): string =>
                                str.replace(/\b\d{16,}\b/g, (numStr) =>
                                    Number.isSafeInteger(Number(numStr)) ? numStr : `"${numStr}"`
                                );

                            if (prop === "text") {
                                const ogText = Reflect.get(target, prop, receiver);
                                return Function.pipe(ogText, Effect.map(replacer));
                            }

                            if (prop === "arrayBuffer") {
                                const ogArrayBuffer = Reflect.get(target, prop, receiver);
                                return Function.pipe(
                                    ogArrayBuffer,
                                    Effect.map((ab) => new TextDecoder().decode(ab)),
                                    Effect.map(replacer),
                                    Effect.map((str) => new TextEncoder().encode(str))
                                );
                            }

                            if (prop === "stream") {
                                const ogStream = Reflect.get(target, prop, receiver);
                                return Function.pipe(
                                    ogStream,
                                    Stream.decodeText(),
                                    Stream.splitLines,
                                    Stream.map(replacer),
                                    Stream.map(String.concat("\n")),
                                    Stream.encodeText
                                );
                            }

                            return Reflect.get(target, prop, receiver);
                        },
                        set: (target, prop, value, receiver) => {
                            return Reflect.set(target, prop, value, receiver);
                        },
                    };

                    return new Proxy(response, handler);
                })
            )
        )
    );
