import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as ParseResult from "effect/ParseResult";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import {
    demuxMultiplexedToSingleSink,
    EitherMultiplexedInput,
    isMultiplexedChannel,
    isMultiplexedSocket,
} from "./multiplexed.js";
import { demuxRawToSingleSink, EitherRawInput, isRawChannel, isRawSocket } from "./raw.js";

/**
 * Demux either a raw socket or a multiplexed socket to a single sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxToSingleSink = Function.dual<
    // Data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R3 = never>(
        sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // Data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    /**
     * We are data-first if the first argument is a channel or if the first
     * argument is an object with a "stdout", "stderr", or "stdin" key.
     */
    (arguments_) =>
        isRawSocket(arguments_[0]) ||
        isRawChannel(arguments_[0]) ||
        isMultiplexedSocket(arguments_[0]) ||
        isMultiplexedChannel(arguments_[0]),

    // Implementation, need the type parameters for checking the underlying.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socketOptions: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        if (isRawSocket(socketOptions) || isRawChannel<E1 | IE, OE, R3>(socketOptions)) {
            return demuxRawToSingleSink(socketOptions, source, sink, options);
        }

        if (isMultiplexedSocket(socketOptions) || isMultiplexedChannel<E1 | IE, OE, R3>(socketOptions)) {
            return demuxMultiplexedToSingleSink(socketOptions, source, Sink.mapInput(sink, Tuple.getSecond), options);
        }

        return Function.absurd(socketOptions);
    }
);
