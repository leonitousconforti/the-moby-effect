/**
 * Common demux utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Console from "effect/Console";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { IExposeSocketOnEffectClientResponse } from "../endpoints/Common.js";
import {
    demuxMultiplexedSocket,
    isMultiplexedStreamSocket,
    MultiplexedStreamSocket,
    MultiplexedStreamSocketContentType,
    MultiplexedStreamSocketTypeId,
    responseIsMultiplexedStreamSocketResponse,
} from "./Multiplexed.js";
import {
    BidirectionalRawStreamSocket,
    demuxBidirectionalRawSocket,
    demuxUnidirectionalRawSockets,
    isBidirectionalRawStreamSocket,
    RawStreamSocketContentType,
    responseToRawStreamSocketOrFail,
    UnidirectionalRawStreamSocket,
} from "./Raw.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export class StdinError extends Data.TaggedError("StdinError")<{ message: string }> {}

/**
 * @since 1.0.0
 * @category Errors
 */
export class StdoutError extends Data.TaggedError("StdoutError")<{ message: string }> {}

/**
 * @since 1.0.0
 * @category Errors
 */
export class StderrError extends Data.TaggedError("StderrError")<{ message: string }> {}

/**
 * @since 1.0.0
 * @category Types
 */
export type CompressedDemuxOutput<A1, A2> = A1 extends undefined | void
    ? A2 extends undefined | void
        ? void
        : readonly [stdout: undefined, stderr: A2]
    : A2 extends undefined | void
      ? readonly [stdout: A1, stderr: undefined]
      : readonly [stdout: A1, stderr: A2];

/**
 * Transforms an http response into a multiplexed stream socket or a raw stream
 * socket. If the response is neither a multiplexed stream socket nor a raw,
 * then an error will be returned.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToStreamingSocketOrFail = <
    SourceIsUnidirectional extends true | false | undefined,
    A extends SourceIsUnidirectional extends true
        ? UnidirectionalRawStreamSocket
        : BidirectionalRawStreamSocket | MultiplexedStreamSocket,
>(
    response: HttpClientResponse.HttpClientResponse,
    options?: { sourceIsUnidirectional?: SourceIsUnidirectional | undefined } | undefined
): Effect.Effect<A, Socket.SocketError, never> =>
    Effect.gen(function* () {
        const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
        const socket = (response as IExposeSocketOnEffectClientResponse).source.socket;
        const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));

        if (responseIsMultiplexedStreamSocketResponse(response)) {
            // Bad, you can't have a unidirectional multiplexed stream socket
            if (options?.sourceIsUnidirectional) {
                return yield* new Socket.SocketGenericError({
                    reason: "Read",
                    error: `Can not have a unidirectional multiplexed stream socket`,
                });
            }

            // Fine to have a multiplexed stream socket now
            else {
                return {
                    ...effectSocket,
                    "content-type": MultiplexedStreamSocketContentType,
                    [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId,
                } as A;
            }
        }

        const maybeRawSocket = yield* responseToRawStreamSocketOrFail(response, options);
        return maybeRawSocket as A;
    });

/**
 * Demux an http socket. The source stream is the stream that you want to
 * forward to the containers stdin. If the socket is a raw stream, then there
 * will only be one sink that combines the containers stdout and stderr. if the
 * socket is a multiplexed stream, then there will be two sinks, one for stdout
 * and one for stderr.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxBidirectionalSocket: {
    <A1, E1, E2, R1, R2>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ): (
        socket: BidirectionalRawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined,
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: BidirectionalRawStreamSocket | MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2?: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        switch (socket["content-type"]) {
            case RawStreamSocketContentType: {
                return demuxBidirectionalRawSocket(socket, source, sink1);
            }
            case MultiplexedStreamSocketContentType: {
                return demuxMultiplexedSocket(socket, source, sink1, sink2!, options);
            }
        }
    }
);

/**
 * Demux either a raw stream socket or a multiplexed stream socket from stdin to
 * stdout and stderr. If given a raw stream socket, then stdout and stderr will
 * be combined on the same sink. If given a multiplexed stream socket, then
 * stdout and stderr will be forwarded to different sinks.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketFromStdinToStdoutAndStderr = <
    UnidirectionalSocketOptions extends {
        stdin: UnidirectionalRawStreamSocket;
        stdout: UnidirectionalRawStreamSocket;
        stderr: UnidirectionalRawStreamSocket;
    },
    SocketOptions extends BidirectionalRawStreamSocket | MultiplexedStreamSocket | UnidirectionalSocketOptions,
    E1 extends SocketOptions extends MultiplexedStreamSocket ? ParseResult.ParseError : never,
>(
    socketOptions: SocketOptions
): Effect.Effect<void, Socket.SocketError | E1 | StdinError | StdoutError | StderrError, never> =>
    Effect.flatMap(
        Effect.all(
            {
                NodeSinkLazy: Effect.promise(() => import("@effect/platform-node/NodeSink")),
                NodeStreamLazy: Effect.promise(() => import("@effect/platform-node/NodeStream")),
            },
            { concurrency: 2 }
        ),
        ({ NodeSinkLazy, NodeStreamLazy }) => {
            type Ret = Effect.Effect<void, Socket.SocketError | E1 | StdinError | StdoutError | StderrError, never>;

            const stdinStream = NodeStreamLazy.fromReadable(
                () => process.stdin,
                (error: unknown) => new StdinError({ message: `stdin is not readable: ${error}` })
            );
            const stdoutSink = NodeSinkLazy.fromWritable(
                () => process.stdout,
                (error: unknown) => new StdoutError({ message: `stdout is not writable: ${error}` }),
                { endOnDone: false }
            );
            const stderrSink = NodeSinkLazy.fromWritable(
                () => process.stderr,
                (error: unknown) => new StderrError({ message: `stderr is not writable: ${error}` }),
                { endOnDone: false }
            );

            if ("stdin" in socketOptions && "stdout" in socketOptions && "stderr" in socketOptions) {
                return demuxUnidirectionalRawSockets({
                    stdin: Tuple.make(stdinStream, socketOptions.stdin),
                    stdout: Tuple.make(socketOptions.stdout, stdoutSink),
                    stderr: Tuple.make(socketOptions.stderr, stderrSink),
                }) as Ret;
            }

            if (isBidirectionalRawStreamSocket(socketOptions)) {
                return demuxBidirectionalRawSocket(socketOptions, stdinStream, stdoutSink) as Ret;
            }

            if (isMultiplexedStreamSocket(socketOptions)) {
                return demuxMultiplexedSocket(socketOptions, stdinStream, stdoutSink, stderrSink) as Ret;
            }

            return Function.absurd<Ret>(socketOptions);
        }
    );

/**
 * Demux either a raw stream socket or a multiplexed stream socket. It will send
 * the input stream to the container and will log all output to the console.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketWithInputToConsole = <
    UnidirectionalSocketOptions extends {
        stdin: UnidirectionalRawStreamSocket;
        stdout: UnidirectionalRawStreamSocket;
        stderr: UnidirectionalRawStreamSocket;
    },
    SocketOptions extends BidirectionalRawStreamSocket | MultiplexedStreamSocket | UnidirectionalSocketOptions,
    E1,
    R1,
    E2 extends SocketOptions extends MultiplexedStreamSocket ? ParseResult.ParseError : never,
>(
    input: Stream.Stream<string | Uint8Array, E1, R1>,
    socketOptions: SocketOptions
): Effect.Effect<void, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope>> => {
    type Ret = Effect.Effect<void, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope>>;

    const stdoutSink = Sink.forEach<string, void, never, never>(Console.log);
    const stderrSink = Sink.forEach<string, void, never, never>(Console.error);

    if ("stdout" in socketOptions && "stderr" in socketOptions && "stdin" in socketOptions) {
        return demuxUnidirectionalRawSockets({
            stdin: Tuple.make(input, socketOptions.stdin),
            stdout: Tuple.make(socketOptions.stdout, stdoutSink),
            stderr: Tuple.make(socketOptions.stderr, stderrSink),
        }) as Ret;
    }

    if (isBidirectionalRawStreamSocket(socketOptions)) {
        return demuxBidirectionalRawSocket(socketOptions, input, stdoutSink) as Ret;
    }

    if (isMultiplexedStreamSocket(socketOptions)) {
        return demuxMultiplexedSocket(socketOptions, input, stdoutSink, stderrSink) as Ret;
    }

    return Function.absurd<Ret>(socketOptions);
};
