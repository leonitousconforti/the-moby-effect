import type * as PlatformError from "@effect/platform/Error";
import type * as Socket from "@effect/platform/Socket";
import type * as Channel from "effect/Channel";
import type * as Chunk from "effect/Chunk";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type * as MobyDemux from "../../MobyDemux.js";

import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Sink from "effect/Sink";

import { asMultiplexedChannel, demuxMultiplexedToSeparateSinks, makeMultiplexedChannel } from "./multiplexed.js";

/** @internal */
export const demuxFromStdinToStdoutAndStderr = <IE = never, OE = Socket.SocketError, R = never>(
    sockets: MobyDemux.EitherMultiplexedInput<IE, OE, R>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
): Effect.Effect<void, IE | OE | PlatformError.PlatformError | ParseResult.ParseError, Exclude<R, Scope.Scope>> =>
    Effect.flatMap(
        Effect.all(
            {
                NodeSinkLazy: Effect.promise(() => import("@effect/platform-node/NodeSink")),
                NodeStreamLazy: Effect.promise(() => import("@effect/platform-node/NodeStream")),
            },
            { concurrency: 2 }
        ),
        ({ NodeSinkLazy, NodeStreamLazy }) => {
            const { underlying } = asMultiplexedChannel(sockets);
            const multiplexedChannel = makeMultiplexedChannel<IE, IE | OE, R>(
                underlying as Channel.Channel<
                    Chunk.Chunk<Uint8Array>,
                    Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
                    OE,
                    IE,
                    void,
                    unknown,
                    R
                >
            );

            return demuxMultiplexedToSeparateSinks(
                multiplexedChannel,
                NodeStreamLazy.stdin,
                NodeSinkLazy.stdout,
                NodeSinkLazy.stderr,
                options
            );
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
