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
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import { IExposeSocketOnEffectClientResponse } from "../endpoints/Common.js";
import {
    demuxMultiplexedSocket,
    isMultiplexedStreamSocketResponse,
    MultiplexedStreamSocket,
    MultiplexedStreamSocketContentType,
} from "./Multiplexed.js";
import { demuxRawSocket, isRawStreamSocketResponse, RawStreamSocket, RawStreamSocketContentType } from "./Raw.js";

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
    <A1, E1, E2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink: Sink.Sink<A1, string, never, E2, never>
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, never>;
    <A1, E1, E2>(
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink: Sink.Sink<A1, string, never, E2, never>
    ): (socket: RawStreamSocket) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, never>;
    <A1, A2, E1, E2, E3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink1: Sink.Sink<A1, string, never, E2, never>,
        sink2: Sink.Sink<A2, string, never, E3, never>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        never
    >;
    <A1, A2, E1, E2, E3>(
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink1: Sink.Sink<A1, string, never, E2, never>,
        sink2: Sink.Sink<A2, string, never, E3, never>,
        options?: { bufferSize?: number | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        never
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined,
    <A1, A2, E1, E2, E3>(
        socket: RawStreamSocket | MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink1: Sink.Sink<A1, string, never, E2, never>,
        sink2?: Sink.Sink<A2, string, never, E3, never>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        A1 | readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        never
    > => {
        switch (socket["content-type"]) {
            case "application/vnd.docker.raw-stream": {
                return demuxRawSocket(socket, source, sink1);
            }
            case "application/vnd.docker.multiplexed-stream": {
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
    socket: RawStreamSocket | MultiplexedStreamSocket
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
            const stdin = NodeStreamLazy.fromReadable(
                () => process.stdin,
                (error: unknown) => new StdinError({ message: `stdin is not readable: ${error}` })
            );
            const stdout = NodeSinkLazy.fromWritable(
                () => process.stdout,
                (error: unknown) => new StdoutError({ message: `stdout is not writable: ${error}` }),
                { endOnDone: false }
            );
            const stderr = NodeSinkLazy.fromWritable(
                () => process.stderr,
                (error: unknown) => new StderrError({ message: `stderr is not writable: ${error}` }),
                { endOnDone: false }
            );

            switch (socket["content-type"]) {
                case "application/vnd.docker.raw-stream": {
                    return demuxRawSocket(socket, stdin, stdout);
                }
                case "application/vnd.docker.multiplexed-stream": {
                    return demuxMultiplexedSocket(socket, stdin, stdout, stderr);
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
    socket: RawStreamSocket | MultiplexedStreamSocket
): Effect.Effect<void, Socket.SocketError | ParseResult.ParseError, never> => {
    const source = Stream.never;
    const sink1 = Sink.forEach(Console.log);
    const sink2 = Sink.forEach(Console.error);

    switch (socket["content-type"]) {
        case "application/vnd.docker.raw-stream": {
            return demuxRawSocket(socket, source, sink1);
        }
        case "application/vnd.docker.multiplexed-stream": {
            return demuxMultiplexedSocket(socket, source, sink1, sink2);
        }
    }
};
