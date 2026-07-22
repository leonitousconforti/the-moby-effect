import type * as Array from "effect/Array";
import type * as Channel from "effect/Channel";
import type * as PlatformError from "effect/PlatformError";
import type * as Schema from "effect/Schema";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type * as Socket from "effect/unstable/socket/Socket";

import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Sink from "effect/Sink";
import * as Stdio from "effect/Stdio";

import type * as MobyDemux from "../../MobyDemux.js";

import { asMultiplexedChannel, demuxMultiplexedToSeparateSinks, makeMultiplexedChannel } from "./multiplexed.js";

/** @internal */
export const demuxFromStdinToStdoutAndStderr = <IE = never, OE = Socket.SocketError, R = never>(
    sockets: MobyDemux.EitherMultiplexedInput<IE, OE, R>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
): Effect.Effect<
    void,
    IE | OE | PlatformError.PlatformError | Schema.SchemaError,
    Exclude<R, Scope.Scope> | Stdio.Stdio
> => {
    const { underlying } = asMultiplexedChannel<IE, OE, R>(sockets);
    const multiplexedChannel = makeMultiplexedChannel<IE | PlatformError.PlatformError, IE | OE, R>(
        underlying as Channel.Channel<
            Array.NonEmptyReadonlyArray<Uint8Array>,
            OE,
            void,
            Array.NonEmptyReadonlyArray<string | Uint8Array | Socket.CloseEvent>,
            IE | PlatformError.PlatformError,
            unknown,
            R
        >
    );

    return Effect.flatMap(Stdio.Stdio, (stdio) =>
        demuxMultiplexedToSeparateSinks(
            multiplexedChannel,
            stdio.stdin,
            stdio.stdout({ endOnDone: false }),
            stdio.stderr({ endOnDone: false }),
            options
        )
    );
};

/** @internal */
export const demuxWithInputToConsole = <E, R1, IE = never, OE = Socket.SocketError, R2 = never>(
    sockets: MobyDemux.EitherMultiplexedInput<E | IE, OE, R2>,
    input: Stream.Stream<string | Uint8Array, E, R1>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
): Effect.Effect<void, E | IE | OE | Schema.SchemaError, Exclude<R1 | R2, Scope.Scope>> =>
    demuxMultiplexedToSeparateSinks(
        sockets,
        input,
        Sink.forEach<string, void, never, never>(Console.log),
        Sink.forEach<string, void, never, never>(Console.error),
        options
    );
