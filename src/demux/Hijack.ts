/**
 * Utilities for hijacking a connection and transforming it into a raw stream.
 * Only works on "server-side" platforms.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";

import { IExposeSocketOnEffectClientResponseHack } from "../platforms/Node.js";
import {
    makeMultiplexedStreamSocket,
    MultiplexedStreamSocket,
    responseIsMultiplexedStreamSocketResponse,
} from "./Multiplexed.js";
import { makeRawStreamSocket, RawStreamSocket, responseIsRawStreamSocketResponse } from "./Raw.js";

/**
 * Transforms an http response into a multiplexed stream socket. If the response
 * is not a multiplexed stream socket, then an error will be returned.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToMultiplexedStreamSocketOrFailUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<MultiplexedStreamSocket, Socket.SocketError, never> =>
    Effect.gen(function* () {
        if (!responseIsMultiplexedStreamSocketResponse(response)) {
            return yield* new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a multiplexed streaming socket`,
            });
        }

        const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
        const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
        const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));
        return makeMultiplexedStreamSocket(effectSocket);
    });

/**
 * Transforms an http response into a raw stream socket. If the response is not
 * a raw stream socket, then an error will be returned.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToRawStreamSocketOrFailUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<RawStreamSocket, Socket.SocketError, never> =>
    Effect.gen(function* () {
        if (!responseIsRawStreamSocketResponse(response)) {
            return yield* new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a raw streaming socket`,
            });
        }

        const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
        const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
        const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));
        return makeRawStreamSocket(effectSocket);
    });

/**
 * Transforms an http response into a multiplexed stream socket or a raw stream
 * socket. If the response is neither a multiplexed stream socket nor a raw or
 * can not be transformed, then an error will be returned.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToStreamingSocketOrFailUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, Socket.SocketError, never> => {
    if (responseIsMultiplexedStreamSocketResponse(response)) {
        return responseToMultiplexedStreamSocketOrFailUnsafe(response);
    }

    if (responseIsRawStreamSocketResponse(response)) {
        return responseToRawStreamSocketOrFailUnsafe(response);
    }

    return Effect.fail(new Socket.SocketGenericError({ reason: "Read", cause: "Response is not a streaming socket" }));
};
