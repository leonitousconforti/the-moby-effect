import type * as Array from "effect/Array";
import type * as Cause from "effect/Cause";
import type * as Schema from "effect/Schema";
import type * as Scope from "effect/Scope";
import type * as Socket from "effect/unstable/socket/Socket";

import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Function from "effect/Function";
import * as Pull from "effect/Pull";
import * as Queue from "effect/Queue";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import type * as MobyDemux from "../../MobyDemux.js";

import { demuxMultiplexedToSeparateSinks, isMultiplexedChannel, isMultiplexedSocket } from "./multiplexed.js";
import { makeRawChannel } from "./raw.js";

/**
 * The fan demux driver runs exactly once, forked into the caller's scope, and
 * the returned channels are pure queue plumbing. This keeps the demux
 * deterministic - there is no racing over which consumer starts the driver,
 * and consuming any subset of the returned channels (in any order) observes
 * all of the data.
 *
 * @internal
 */
export const fan = Function.dual<
    <IE = never, OE = Socket.SocketError, R = never>(options: {
        readonly requestedCapacity:
            | number
            | {
                  readonly stdinCapacity: number;
                  readonly stdoutCapacity: number;
                  readonly stderrCapacity: number;
              };
        readonly encoding?: string | undefined;
    }) => (multiplexedInput: MobyDemux.EitherMultiplexedInput<IE, OE, R>) => Effect.Effect<
        {
            stdin: MobyDemux.RawChannel<IE, IE | OE | Schema.SchemaError, never>;
            stdout: MobyDemux.RawChannel<IE, IE | OE | Schema.SchemaError, never>;
            stderr: MobyDemux.RawChannel<IE, IE | OE | Schema.SchemaError, never>;
        },
        never,
        R | Scope.Scope
    >,
    <IE = never, OE = Socket.SocketError, R = never>(
        multiplexedInput: MobyDemux.EitherMultiplexedInput<IE, OE, R>,
        options: {
            readonly requestedCapacity:
                | number
                | {
                      readonly stdinCapacity: number;
                      readonly stdoutCapacity: number;
                      readonly stderrCapacity: number;
                  };
            readonly encoding?: string | undefined;
        }
    ) => Effect.Effect<
        {
            stdin: MobyDemux.RawChannel<IE, IE | OE | Schema.SchemaError, never>;
            stdout: MobyDemux.RawChannel<IE, IE | OE | Schema.SchemaError, never>;
            stderr: MobyDemux.RawChannel<IE, IE | OE | Schema.SchemaError, never>;
        },
        never,
        R | Scope.Scope
    >
>(
    (arguments_) => isMultiplexedChannel(arguments_[0]) || isMultiplexedSocket(arguments_[0]),
    Effect.fnUntraced(function* <IE = never, OE = Socket.SocketError, R = never>(
        multiplexedInput: MobyDemux.EitherMultiplexedInput<IE, OE, R>,
        options: {
            readonly requestedCapacity:
                | number
                | {
                      readonly stdinCapacity: number;
                      readonly stdoutCapacity: number;
                      readonly stderrCapacity: number;
                  };
            readonly encoding?: string | undefined;
        }
    ) {
        type CanReceive = string | Uint8Array | Socket.CloseEvent;
        type FanError = IE | OE | Schema.SchemaError;

        // Internal buffers. The consumer queues carry the driver's failure so
        // that a demux error surfaces on whichever channels are being read.
        const capacity = options.requestedCapacity;
        const stdoutConsumerQueue = yield* Queue.bounded<string, FanError | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdoutCapacity
        );
        const stderrConsumerQueue = yield* Queue.bounded<string, FanError | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stderrCapacity
        );
        const stdinProducerQueue = yield* Queue.bounded<CanReceive, IE | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdinCapacity
        );

        // The driver demuxes the multiplexed input into the consumer queues
        // and pumps the stdin producer queue into it. On completion the
        // consumer queues are ended; on failure the failure is forwarded to
        // them so it surfaces on whichever channels are being read.
        const driver = yield* demuxMultiplexedToSeparateSinks(
            multiplexedInput,
            Stream.fromQueue(stdinProducerQueue),
            Sink.forEachArray((chunk) => Queue.offerAll(stdoutConsumerQueue, chunk)),
            Sink.forEachArray((chunk) => Queue.offerAll(stderrConsumerQueue, chunk)),
            {
                bufferSize: 32,
                encoding: options.encoding,
            }
        ).pipe(
            Effect.tap(() => Effect.andThen(Queue.end(stdoutConsumerQueue), Queue.end(stderrConsumerQueue))),
            Effect.tapCause((cause) =>
                Effect.andThen(Queue.failCause(stdoutConsumerQueue, cause), Queue.failCause(stderrConsumerQueue, cause))
            ),
            Effect.forkScoped
        );

        // Forwards the stdin channel's input into the stdin producer queue,
        // propagating input errors and the end-of-input signal.
        const feedStdin = (
            upstream: Pull.Pull<Array.NonEmptyReadonlyArray<CanReceive>, IE, unknown, never>
        ): Effect.Effect<void> =>
            upstream.pipe(
                Effect.flatMap((chunk) => Queue.offerAll(stdinProducerQueue, chunk)),
                Effect.forever,
                Pull.catchDone(() => Queue.end(stdinProducerQueue)),
                Effect.catchCause((cause) => Queue.failCause(stdinProducerQueue, cause)),
                Effect.asVoid
            );

        // The stdin channel completes (or fails) with the driver.
        const independentStdinChannel = Channel.fromEffectDrain(Fiber.join(driver)).pipe(
            Channel.embedInput<Array.NonEmptyReadonlyArray<CanReceive>, IE, unknown, never>(feedStdin),
            makeRawChannel<IE, IE | OE | Schema.SchemaError, never>
        );

        const independentStdoutChannel = Stream.fromQueue(stdoutConsumerQueue).pipe(
            Stream.encodeText,
            Stream.toChannel,
            makeRawChannel<IE, IE | OE | Schema.SchemaError, never>
        );

        const independentStderrChannel = Stream.fromQueue(stderrConsumerQueue).pipe(
            Stream.encodeText,
            Stream.toChannel,
            makeRawChannel<IE, IE | OE | Schema.SchemaError, never>
        );

        return {
            stdin: independentStdinChannel,
            stdout: independentStdoutChannel,
            stderr: independentStderrChannel,
        };
    })
);
