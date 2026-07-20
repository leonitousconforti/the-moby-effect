import type * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientRequest from "effect/unstable/http/HttpClientRequest";

import type * as MobyConnection from "../../MobyConnection.js";

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

/**
 * Matches one complete JSON number token (integer or float, optional sign and
 * exponent) anchored at the current scan position.
 *
 * @internal
 */
const numberToken = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

/**
 * Wraps every JSON number that is not inside a quoted string in quotes, so
 * that 64-bit fields can be decoded losslessly as bigints from strings. A
 * plain regex cannot do this: digits inside quoted strings (dates like
 * "2023-08-30T22:26:00.000000000Z", ip addresses like "127.0.0.1", or any
 * label value containing ": 123,") must not be touched, value-position
 * matching misses array elements and negative numbers, and tokens like
 * -1.5e9 must be quoted whole. So this walks the text tracking whether the
 * position is inside a string (honoring backslash escapes) and quotes only
 * complete number tokens found outside of strings.
 *
 * @internal
 */
export const replacer = (text: string): string => {
    let output = "";
    let index = 0;
    let insideString = false;

    while (index < text.length) {
        const char = text[index]!;

        if (insideString) {
            output += char;
            if (char === "\\") {
                output += text[index + 1] ?? "";
                index += 2;
                continue;
            }
            if (char === '"') insideString = false;
            index += 1;
            continue;
        }

        if (char === '"') {
            insideString = true;
            output += char;
            index += 1;
            continue;
        }

        numberToken.lastIndex = index;
        const match = numberToken.exec(text);
        if (Predicate.isNotNull(match)) {
            output += `"${match[0]}"`;
            index += match[0].length;
            continue;
        }

        output += char;
        index += 1;
    }

    return output;
};

/** @internal */
export const makeAgnosticHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient> =>
    Layer.effect(
        HttpClient.HttpClient,
        Effect.map(
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
                                // Binary bodies (tarballs, multiplexed log streams) must
                                // pass through untouched - only json bodies carry numbers
                                // that need re-quoting for lossless bigint decoding.
                                const contentType = target.headers["content-type"] ?? "";
                                if (!contentType.includes("application/json")) {
                                    return Reflect.get(target, prop, receiver);
                                }

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
                                        Effect.map((str) => new TextEncoder().encode(str).buffer as ArrayBuffer)
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
        )
    );
