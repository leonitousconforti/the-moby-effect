import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";

import { IExposeSocketOnEffectClientResponseHack } from "../platforms/node.js";
import { makeMultiplexedSocket, MultiplexedSocket, responseIsMultiplexedResponse } from "./multiplexed.js";
import { makeRawSocket, RawSocket, responseIsRawResponse } from "./raw.js";

/**
 * Hijacks an http response into a socket.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Transformations
 */
export const hijackResponseUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<Socket.Socket, Socket.SocketError, never> =>
    Effect.flatMap(
        Effect.promise(() => import("@effect/platform-node/NodeSocket")),
        (nodeSocketLazy) => {
            const socket = (response as IExposeSocketOnEffectClientResponseHack).original.source.socket;
            return nodeSocketLazy.fromDuplex(Effect.sync(() => socket));
        }
    );

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
): Effect.Effect<MultiplexedSocket, Socket.SocketError, never> => {
    if (!responseIsMultiplexedResponse(response)) {
        return Effect.fail(
            new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a multiplexed streaming socket`,
            })
        );
    }

    return Effect.map(hijackResponseUnsafe(response), makeMultiplexedSocket);
};

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
): Effect.Effect<RawSocket, Socket.SocketError, never> => {
    if (!responseIsRawResponse(response)) {
        return Effect.fail(
            new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a raw streaming socket`,
            })
        );
    }

    return Effect.map(hijackResponseUnsafe(response), makeRawSocket);
};

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
): Effect.Effect<RawSocket | MultiplexedSocket, Socket.SocketError, never> => {
    if (responseIsMultiplexedResponse(response)) {
        return responseToMultiplexedStreamSocketOrFailUnsafe(response);
    }

    if (responseIsRawResponse(response)) {
        return responseToRawStreamSocketOrFailUnsafe(response);
    }

    return Effect.fail(new Socket.SocketGenericError({ reason: "Read", cause: "Response is not a streaming socket" }));
};
