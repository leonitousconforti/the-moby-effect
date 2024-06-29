/**
 * Request helpers
 *
 * @since 1.0.0
 */

import * as net from "node:net";

import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Function from "effect/Function";
import * as Option from "effect/Option";

/**
 * Helper interface to expose the underlying socket from the effect HttpClient
 * response. Useful for multiplexing the response stream. TODO: This is kinda a
 * hack, can we find a better way?
 *
 * @internal
 */
export interface IExposeSocketOnEffectClientResponse extends HttpClientResponse.HttpClientResponse {
    source: {
        socket: net.Socket;
    };
}

/**
 * Takes a key and an optional value and returns a function that either adds the
 * key and value to the query parameters of a request if the value was a Some or
 * does nothing if its a None.
 *
 * @internal
 */
export const maybeAddQueryParameter = (
    key: string,
    value: Option.Option<unknown>
): ((self: HttpClientRequest.HttpClientRequest) => HttpClientRequest.HttpClientRequest) =>
    Option.match({
        onNone: Function.constant(Function.identity),
        onSome: (val) => HttpClientRequest.setUrlParam(key, String(val)),
    })(value);

/**
 * Takes a key and an optional value and returns a function that either adds the
 * key and value to the headers of a request if the value was a Some or does
 * nothing if its a None.
 *
 * @internal
 */
export const maybeAddHeader = (
    key: string,
    value: Option.Option<string>
): ((self: HttpClientRequest.HttpClientRequest) => HttpClientRequest.HttpClientRequest) =>
    Option.match(value, {
        onNone: Function.constant(Function.identity),
        onSome: (val) => HttpClientRequest.setHeader(key, val),
    });
