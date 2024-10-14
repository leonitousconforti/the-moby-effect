/**
 * Utilities for hijacking a connection and transforming it into a raw stream.
 * Only works on "server-side" platforms.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";

import { IExposeSocketOnEffectClientResponseHack } from "../platforms/Node.js";
import {
    makeMultiplexedStreamSocket,
    MultiplexedStreamSocket,
    responseIsMultiplexedStreamSocketResponse,
} from "./Multiplexed.js";
import {
    BidirectionalRawStreamSocket,
    downcastBidirectionalToUnidirectional,
    makeBidirectionalRawStreamSocket,
    responseIsRawStreamSocketResponse,
    UnidirectionalRawStreamSocket,
} from "./Raw.js";

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
        if (responseIsMultiplexedStreamSocketResponse(response)) {
            const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
            const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
            const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));
            return makeMultiplexedStreamSocket(effectSocket);
        } else {
            return yield* new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a multiplexed streaming socket`,
            });
        }
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
export const responseToRawStreamSocketOrFailUnsafe = Function.dual<
    // Data-last signature
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ) => (
        response: HttpClientResponse.HttpClientResponse
    ) => Effect.Effect<
        SourceIsKnownUnidirectional extends true
            ? UnidirectionalRawStreamSocket
            : SourceIsKnownBidirectional extends true
              ? BidirectionalRawStreamSocket
              : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket,
        Socket.SocketError,
        never
    >,
    // Data-first signature
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        response: HttpClientResponse.HttpClientResponse,
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ) => Effect.Effect<
        SourceIsKnownUnidirectional extends true
            ? UnidirectionalRawStreamSocket
            : SourceIsKnownBidirectional extends true
              ? BidirectionalRawStreamSocket
              : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket,
        Socket.SocketError,
        never
    >
>(
    (_arguments) => _arguments[0][HttpClientResponse.TypeId] !== undefined,
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        response: HttpClientResponse.HttpClientResponse,
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ): Effect.Effect<
        SourceIsKnownUnidirectional extends true
            ? UnidirectionalRawStreamSocket
            : SourceIsKnownBidirectional extends true
              ? BidirectionalRawStreamSocket
              : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket,
        Socket.SocketError,
        never
    > =>
        Effect.gen(function* () {
            type Ret = SourceIsKnownUnidirectional extends true
                ? UnidirectionalRawStreamSocket
                : SourceIsKnownBidirectional extends true
                  ? BidirectionalRawStreamSocket
                  : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket;

            if (!responseIsRawStreamSocketResponse(response)) {
                return yield* new Socket.SocketGenericError({
                    reason: "Read",
                    cause: `Response with content type "${response.headers["content-type"]}" is not a raw streaming socket`,
                });
            }

            const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
            const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
            const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));
            const bidirectional = makeBidirectionalRawStreamSocket(effectSocket);

            const sourceIsKnownUnidirectional =
                Predicate.isNotUndefined(options) &&
                Predicate.hasProperty(options, "sourceIsKnownUnidirectional") &&
                options.sourceIsKnownUnidirectional === true;

            return sourceIsKnownUnidirectional
                ? (downcastBidirectionalToUnidirectional(bidirectional) as Ret)
                : (bidirectional as Ret);
        })
);

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
export const responseToStreamingSocketOrFailUnsafe = Function.dual<
    // Data-last signature
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ) => (
        response: HttpClientResponse.HttpClientResponse
    ) => Effect.Effect<
        | MultiplexedStreamSocket
        | (SourceIsKnownUnidirectional extends true
              ? UnidirectionalRawStreamSocket
              : SourceIsKnownBidirectional extends true
                ? BidirectionalRawStreamSocket
                : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket),
        Socket.SocketError,
        never
    >,
    // Data-first signature
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        response: HttpClientResponse.HttpClientResponse,
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ) => Effect.Effect<
        | MultiplexedStreamSocket
        | (SourceIsKnownUnidirectional extends true
              ? UnidirectionalRawStreamSocket
              : SourceIsKnownBidirectional extends true
                ? BidirectionalRawStreamSocket
                : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket),
        Socket.SocketError,
        never
    >
>(
    (_arguments) => _arguments[0][HttpClientResponse.TypeId] !== undefined,
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        response: HttpClientResponse.HttpClientResponse,
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ): Effect.Effect<
        | MultiplexedStreamSocket
        | (SourceIsKnownUnidirectional extends true
              ? UnidirectionalRawStreamSocket
              : SourceIsKnownBidirectional extends true
                ? BidirectionalRawStreamSocket
                : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket),
        Socket.SocketError,
        never
    > =>
        Effect.gen(function* () {
            const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
            const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
            const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));

            if (responseIsMultiplexedStreamSocketResponse(response)) {
                // Bad, you can't have a unidirectional multiplexed stream socket
                if (
                    Predicate.isNotUndefined(options) &&
                    "sourceIsKnownUnidirectional" in options &&
                    options.sourceIsKnownUnidirectional
                ) {
                    return yield* new Socket.SocketGenericError({
                        reason: "Read",
                        cause: `Can not have a unidirectional multiplexed stream socket`,
                    });
                }

                // Fine to have a multiplexed stream socket now
                return makeMultiplexedStreamSocket(effectSocket);
            }

            return yield* responseToRawStreamSocketOrFailUnsafe(response, options);
        })
);
