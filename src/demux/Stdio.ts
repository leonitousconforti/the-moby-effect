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

import { Demux, demuxUnknownToSeparateSinks } from "./Demux.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export class StdinError extends Data.TaggedError("StdinError")<{ message: string; cause: unknown }> {}

/**
 * @since 1.0.0
 * @category Errors
 */
export class StdoutError extends Data.TaggedError("StdoutError")<{ message: string; cause: unknown }> {}

/**
 * @since 1.0.0
 * @category Errors
 */
export class StderrError extends Data.TaggedError("StderrError")<{ message: string; cause: unknown }> {}

/**
 * Demux either a raw stream socket or a multiplexed stream socket from stdin to
 * stdout and stderr. If given a raw stream socket, then stdout and stderr will
 * be combined on the same sink. If given a multiplexed stream socket, then
 * stdout and stderr will be forwarded to different sinks. If given multiple raw
 * stream sockets, then you can provide different individual sockets for stdin,
 * stdout, and stderr.
 *
 * If you are looking for a way to demux to the console instead of stdin,
 * stdout, and stderr then see {@link demuxSocketWithInputToConsole}. Since we
 * are interacting with stdin, stdout, and stderr this function dynamically
 * imports the `@effect/platform-node` package.
 *
 * @since 1.0.0
 * @category DemuxStdio
 */
export const demuxSocketFromStdinToStdoutAndStderr = (
    sockets: Demux.AnySocketOptions,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
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
            const stdin: Stream.Stream<Uint8Array, StdinError, never> = NodeStreamLazy.fromReadable(
                () => process.stdin,
                (error: unknown) => new StdinError({ cause: error, message: `stdin is not readable: ${error}` })
            );
            const stdout: Sink.Sink<void, string | Uint8Array, never, StdoutError, never> = NodeSinkLazy.fromWritable(
                () => process.stdout,
                (error: unknown) => new StdoutError({ cause: error, message: `stdout is not writable: ${error}` }),
                { endOnDone: false }
            );
            const stderr: Sink.Sink<void, string | Uint8Array, never, StderrError, never> = NodeSinkLazy.fromWritable(
                () => process.stderr,
                (error: unknown) => new StderrError({ cause: error, message: `stderr is not writable: ${error}` }),
                { endOnDone: false }
            );

            return demuxUnknownToSeparateSinks(sockets, stdin, stdout, stderr, options);
        }
    );

/**
 * Demux either a raw stream socket or a multiplexed stream socket to the
 * console. If given a raw stream socket, then stdout and stderr will be
 * combined on the same sink. If given a multiplexed stream socket, then stdout
 * and stderr will be forwarded to different sinks. If given multiple raw stream
 * sockets, then you can provide different individual sockets for stdin, stdout,
 * and stderr.
 *
 * If you are looking for a way to demux to stdin, stdout, and stderr instead of
 * the console then see {@link demuxSocketFromStdinToStdoutAndStderr}.
 *
 * @since 1.0.0
 * @category DemuxStdio
 */
export const demuxSocketWithInputToConsole = <E1, R1>(
    sockets: Demux.AnySocketOptions,
    input: Stream.Stream<string | Uint8Array, E1, R1>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
): Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>> =>
    demuxUnknownToSeparateSinks(
        sockets,
        input,
        Sink.forEach<string, void, never, never>(Console.log),
        Sink.forEach<string, void, never, never>(Console.error),
        options
    );
