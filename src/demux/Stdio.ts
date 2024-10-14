/**
 * Demux utilities for stdin, stdout/console.log, and stderr/console.error
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Console from "effect/Console";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import { demuxUnknownToSeparateSinks } from "./Demux.js";
import { MultiplexedStreamSocket } from "./Multiplexed.js";
import { BidirectionalRawStreamSocket, UnidirectionalRawStreamSocket } from "./Raw.js";

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
 * Demux either a raw stream socket or a multiplexed stream socket from stdin to
 * stdout and stderr. If given a bidirectional raw stream socket, then stdout
 * and stderr will be combined on the same sink. If given a multiplexed stream
 * socket, then stdout and stderr will be forwarded to different sinks. If given
 * a unidirectional raw stream socket, then you are only required to provide one
 * for stdout but can also provide sockets for stdin and stderr as well.
 *
 * If you are looking for a way to demux to the console instead of stdin,
 * stdout, and stderr then see {@link demuxSocketWithInputToConsole}. Since we
 * are interacting with stdin, stdout, and stderr this function dynamically
 * imports the `@effect/platform-node` package.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketFromStdinToStdoutAndStderr = (
    sockets:
        | BidirectionalRawStreamSocket
        | MultiplexedStreamSocket
        | {
              stdout: UnidirectionalRawStreamSocket;
              stdin?: UnidirectionalRawStreamSocket | undefined;
              stderr?: UnidirectionalRawStreamSocket | undefined;
          },
    options?: { encoding: string | undefined } | undefined
): Effect.Effect<void, StdinError | StdoutError | StderrError | Socket.SocketError | ParseResult.ParseError, never> =>
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

            const helper = demuxUnknownToSeparateSinks(stdinStream, stdoutSink, stderrSink, options) as (
                socketOptions:
                    | BidirectionalRawStreamSocket
                    | MultiplexedStreamSocket
                    | {
                          stdout: UnidirectionalRawStreamSocket;
                          stdin?: UnidirectionalRawStreamSocket | undefined;
                          stderr?: UnidirectionalRawStreamSocket | undefined;
                      }
            ) => Effect.Effect<
                void,
                StdinError | StdoutError | StderrError | Socket.SocketError | ParseResult.ParseError,
                never
            >;

            return helper(sockets);
        }
    );

/**
 * Demux either a raw stream socket or a multiplexed stream socket to the
 * console. If given a bidirectional raw stream socket, then stdout and stderr
 * will be combined on the same sink. If given a multiplexed stream socket, then
 * stdout and stderr will be forwarded to different sinks. If given a
 * unidirectional raw stream socket, then you are only required to provide one
 * for stdout but can also provide sockets for stdin and stderr as well.
 *
 * If you are looking for a way to demux to stdin, stdout, and stderr instead of
 * the console then see {@link demuxSocketFromStdinToStdoutAndStderr}.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketWithInputToConsole: {
    <E1, R1>(
        input: Stream.Stream<string | Uint8Array, E1, R1>,
        options?: { encoding: string | undefined } | undefined
    ): (
        socket: BidirectionalRawStreamSocket
    ) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>;
    <E1, R1>(
        input: Stream.Stream<string | Uint8Array, E1, R1>,
        options?: { encoding: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>;
    <E1, R1>(
        input: Stream.Stream<string | Uint8Array, E1, R1>,
        options?: { encoding: string | undefined } | undefined
    ): (sockets: {
        stdout: UnidirectionalRawStreamSocket;
        stdin?: UnidirectionalRawStreamSocket | undefined;
        stderr?: UnidirectionalRawStreamSocket | undefined;
    }) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>;
} = <E1, R1>(
    input: Stream.Stream<string | Uint8Array, E1, R1>,
    options?: { encoding: string | undefined } | undefined
) =>
    demuxUnknownToSeparateSinks(
        input,
        Sink.forEach<string, void, never, never>(Console.log),
        Sink.forEach<string, void, never, never>(Console.error),
        options
    ) as {
        (
            socket: BidirectionalRawStreamSocket
        ): Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>;
        (
            socket: MultiplexedStreamSocket
        ): Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>;
        (sockets: {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        }): Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>;
    };
