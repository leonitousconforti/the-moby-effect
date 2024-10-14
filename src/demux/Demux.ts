/**
 * Common demux utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { CompressedDemuxOutput } from "./Compressed.js";
import { demuxMultiplexedSocket, isMultiplexedStreamSocket, MultiplexedStreamSocket } from "./Multiplexed.js";
import {
    BidirectionalRawStreamSocket,
    demuxBidirectionalRawSocket,
    demuxUnidirectionalRawSockets,
    isBidirectionalRawStreamSocket,
    isUnidirectionalRawStreamSocket,
    UnidirectionalRawStreamSocket,
} from "./Raw.js";

/**
 * Demux either a bidirectional raw socket, multiplexed socket, or
 * unidirectional raw socket(s) to a single sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxToSingleSink: {
    // Demux a bidirectional raw socket to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux a bidirectional raw socket to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): (
        socket: BidirectionalRawStreamSocket
    ) => Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux a bidirectional multiplexed socket to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux a bidirectional multiplexed socket to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux unidirectional socket to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: UnidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux unidirectional socket to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): (
        sockets: UnidirectionalRawStreamSocket
    ) => Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux unidirectional sockets to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        sockets: {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux unidirectional sockets to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): (sockets: {
        stdout: UnidirectionalRawStreamSocket;
        stdin?: UnidirectionalRawStreamSocket | undefined;
        stderr?: UnidirectionalRawStreamSocket | undefined;
    }) => Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined || "stdout" in arguments_[0],
    <A1, E1, E2, R1, R2>(
        socketOptions:
            | BidirectionalRawStreamSocket
            | MultiplexedStreamSocket
            | UnidirectionalRawStreamSocket
            | {
                  stdout: UnidirectionalRawStreamSocket;
                  stdin?: UnidirectionalRawStreamSocket | undefined;
                  stderr?: UnidirectionalRawStreamSocket | undefined;
              },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    > => {
        if ("stdout" in socketOptions) {
            return demuxUnidirectionalRawSockets(socketOptions, source, sink, options);
        }

        if (isUnidirectionalRawStreamSocket(socketOptions)) {
            return demuxUnidirectionalRawSockets({ stdout: socketOptions }, source, sink, options);
        }

        if (isBidirectionalRawStreamSocket(socketOptions)) {
            return demuxBidirectionalRawSocket(socketOptions, source, sink, options);
        }

        if (isMultiplexedStreamSocket(socketOptions)) {
            return demuxMultiplexedSocket(socketOptions, source, sink, options);
        }

        return Function.absurd(socketOptions);
    }
);

/**
 * Demux either a multiplexed socket or unidirectional socket(s) to separate
 * sinks. If you need to also demux a bidirectional raw socket, then use
 * {@link demuxUnknownToSeparateSinks} instead.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxToSeparateSinks: {
    // Demux a bidirectional multiplexed socket to two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux a bidirectional multiplexed socket to two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux unidirectional socket(s) to two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        sockets: {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux unidirectional socket(s) to two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (sockets: {
        stdout: UnidirectionalRawStreamSocket;
        stdin?: UnidirectionalRawStreamSocket | undefined;
        stderr?: UnidirectionalRawStreamSocket | undefined;
    }) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined || "stdout" in arguments_[0],
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socketOptions:
            | MultiplexedStreamSocket
            | {
                  stdout: UnidirectionalRawStreamSocket;
                  stdin?: UnidirectionalRawStreamSocket | undefined;
                  stderr?: UnidirectionalRawStreamSocket | undefined;
              },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        if ("stdout" in socketOptions) {
            const stdinTuple = Predicate.isNotUndefined(socketOptions.stdin)
                ? { stdin: Tuple.make(source, socketOptions.stdin) }
                : {};
            const stderrTuple = Predicate.isNotUndefined(socketOptions.stderr)
                ? { stderr: Tuple.make(socketOptions.stderr, sink2) }
                : {};
            const stdoutTuple = { stdout: Tuple.make(socketOptions.stdout, sink1) };
            return demuxUnidirectionalRawSockets({ ...stdinTuple, ...stdoutTuple, ...stderrTuple });
        }

        return demuxMultiplexedSocket(socketOptions, source, sink1, sink2, options);
    }
);

/**
 * Demux a bidirectional raw socket, multiplexed socket, or unidirectional raw
 * sockets to two sinks. If given a bidirectional raw stream socket, then stdout
 * and stderr will be combined on the same sink. If given a multiplexed stream
 * socket, then stdout and stderr will be forwarded to different sinks. If given
 * a unidirectional raw stream sockets, then you are only required to provide
 * one for stdout but can also provide sockets for stdin and stderr as well. The
 * return type will depend on the type of socket provided, so this isn't
 * suitable for all use cases.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxUnknownToSeparateSinks: {
    // Demux a bidirectional raw socket, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux a bidirectional raw socket, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: BidirectionalRawStreamSocket
    ) => Effect.Effect<
        A1,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux a bidirectional multiplexed socket to two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux a bidirectional multiplexed socket to two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux unidirectional sockets to two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        sockets: {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux unidirectional sockets to two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (sockets: {
        stdout: UnidirectionalRawStreamSocket;
        stdin?: UnidirectionalRawStreamSocket | undefined;
        stderr?: UnidirectionalRawStreamSocket | undefined;
    }) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined || "stdout" in arguments_[0],
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socketOptions:
            | BidirectionalRawStreamSocket
            | MultiplexedStreamSocket
            | {
                  stdout: UnidirectionalRawStreamSocket;
                  stdin?: UnidirectionalRawStreamSocket | undefined;
                  stderr?: UnidirectionalRawStreamSocket | undefined;
              },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        if (isBidirectionalRawStreamSocket(socketOptions)) {
            return demuxBidirectionalRawSocket(socketOptions, source, sink1, options);
        }

        if (isMultiplexedStreamSocket(socketOptions)) {
            return demuxToSeparateSinks(socketOptions, source, sink1, sink2, options);
        }

        return demuxToSeparateSinks(socketOptions, source, sink1, sink2, options);
    }
);
