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
    isMultiplexedStreamSocketResponse,
    MultiplexedStreamSocket,
    MultiplexedStreamSocketContentType,
} from "./Multiplexed.js";
import {
    demuxRawSocket,
    demuxRawSockets,
    isRawStreamSocketResponse,
    RawStreamSocket,
    RawStreamSocketContentType,
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
 * Transforms an http response into a multiplexed stream socket or a raw stream
 * socket. If the response is neither a multiplexed stream socket nor a raw,
 * then an error will be returned.
 *
 * @since 1.0.0
 * @category Demux
 */
export const responseToStreamingSocketOrFail = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, Socket.SocketError, never> =>
    Effect.gen(function* () {
        const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
        const socket = (response as IExposeSocketOnEffectClientResponse).source.socket;
        const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));

        if (isRawStreamSocketResponse(response)) {
            return RawStreamSocket({ ...effectSocket, "content-type": RawStreamSocketContentType });
        } else if (isMultiplexedStreamSocketResponse(response)) {
            return MultiplexedStreamSocket({ ...effectSocket, "content-type": MultiplexedStreamSocketContentType });
        } else {
            return yield* new Socket.SocketGenericError({
                reason: "Read",
                error: `Response with content type "${response.headers["content-type"]}" is not a streaming socket`,
            });
        }
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
export const demuxSocket: {
    <A1, E1, E2, R1, R2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ): (
        socket: RawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        readonly [stdout: A1, stderr: A2],
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
        readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined,
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: RawStreamSocket | MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2?: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        A1 | readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        switch (socket["content-type"]) {
            case RawStreamSocketContentType: {
                return demuxRawSocket(socket, source, sink1);
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
export const demuxSocketFromStdinToStdoutAndStderr = (
    streams:
        | RawStreamSocket
        | MultiplexedStreamSocket
        | { stdin: RawStreamSocket; stdout: RawStreamSocket; stderr: RawStreamSocket }
): Effect.Effect<void, Socket.SocketError | ParseResult.ParseError | StdinError | StdoutError | StderrError, never> =>
    Effect.flatMap(
        Effect.all(
            {
                NodeSinkLazy: Effect.promise(() => import("@effect/platform-node/NodeSink")),
                NodeStreamLazy: Effect.promise(() => import("@effect/platform-node/NodeStream")),
            },
            { concurrency: 2 }
        ),
        ({ NodeSinkLazy, NodeStreamLazy }) => {
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

            if ("stdin" in streams && "stdout" in streams && "stderr" in streams) {
                return demuxRawSockets({
                    stdin: Tuple.make(stdinStream, streams.stdin),
                    stdout: Tuple.make(streams.stdout, stdoutSink),
                    stderr: Tuple.make(streams.stderr, stderrSink),
                });
            }

            switch (streams["content-type"]) {
                case RawStreamSocketContentType: {
                    return demuxRawSocket(streams, stdinStream, stdoutSink);
                }
                case MultiplexedStreamSocketContentType: {
                    return demuxMultiplexedSocket(streams, stdinStream, stdoutSink, stderrSink);
                }
            }
        }
    );

/**
 * Demux either a raw stream socket or a multiplexed stream socket. It will send
 * no input to the container and will log all output to the console.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketNoInputToConsole = (
    streams: RawStreamSocket | MultiplexedStreamSocket | { stdout: RawStreamSocket; stderr: RawStreamSocket }
): Effect.Effect<void, Socket.SocketError | ParseResult.ParseError, never> => {
    const stdinStream = Stream.never;
    const stdoutSink = Sink.forEach(Console.log);
    const stderrSink = Sink.forEach(Console.error);

    if ("stdout" in streams && "stderr" in streams) {
        return demuxRawSockets({
            stdout: Tuple.make(streams.stdout, stdoutSink),
            stderr: Tuple.make(streams.stderr, stderrSink),
        });
    }

    switch (streams["content-type"]) {
        case RawStreamSocketContentType: {
            return demuxRawSocket(streams, stdinStream, stdoutSink);
        }
        case MultiplexedStreamSocketContentType: {
            return demuxMultiplexedSocket(streams, stdinStream, stdoutSink, stderrSink);
        }
    }
};
