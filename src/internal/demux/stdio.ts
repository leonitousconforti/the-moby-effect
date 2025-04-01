import type * as Socket from "@effect/platform/Socket";
import type * as Channel from "effect/Channel";
import type * as Chunk from "effect/Chunk";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as MobyDemux from "../../MobyDemux.js";

import * as Console from "effect/Console";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import { asMultiplexedChannel, demuxMultiplexedToSeparateSinks, makeMultiplexedChannel } from "./multiplexed.js";

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

/** @internal */
export const demuxFromStdinToStdoutAndStderr = <IE = never, OE = Socket.SocketError, R = never>(
    sockets: MobyDemux.EitherMultiplexedInput<IE, OE, R>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
): Effect.Effect<
    void,
    IE | OE | StdinError | StdoutError | StderrError | ParseResult.ParseError,
    Exclude<R, Scope.Scope>
> =>
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
                (cause: unknown) => new StdinError({ cause, message: "stdin is not readable" })
            );
            const stdout: Sink.Sink<void, string | Uint8Array, never, StdoutError, never> = NodeSinkLazy.fromWritable(
                () => process.stdout,
                (cause: unknown) => new StdoutError({ cause, message: "stdout is not writable" }),
                { endOnDone: false }
            );
            const stderr: Sink.Sink<void, string | Uint8Array, never, StderrError, never> = NodeSinkLazy.fromWritable(
                () => process.stderr,
                (cause: unknown) => new StderrError({ cause, message: "stderr is not writable" }),
                { endOnDone: false }
            );

            const { underlying } = asMultiplexedChannel(sockets);
            const multiplexedChannel = makeMultiplexedChannel<IE | StdinError, IE | OE | StdinError, R>(
                underlying as Channel.Channel<
                    Chunk.Chunk<Uint8Array>,
                    Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
                    IE | OE | StdinError,
                    IE | StdinError,
                    void,
                    unknown,
                    R
                >
            );

            return demuxMultiplexedToSeparateSinks(multiplexedChannel, stdin, stdout, stderr, options);
        }
    );

/** @internal */
export const demuxWithInputToConsole = <E, R1, IE = never, OE = Socket.SocketError, R2 = never>(
    sockets: MobyDemux.EitherMultiplexedInput<E | IE, OE, R2>,
    input: Stream.Stream<string | Uint8Array, E, R1>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
): Effect.Effect<void, E | IE | OE | ParseResult.ParseError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =>
    demuxMultiplexedToSeparateSinks(
        sockets,
        input,
        Sink.forEach<string, void, never, never>(Console.log),
        Sink.forEach<string, void, never, never>(Console.error),
        options
    );
