import type * as Array from "effect/Array";
import type * as Cause from "effect/Cause";
import type * as Schema from "effect/Schema";
import type * as Socket from "effect/unstable/socket/Socket";

import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Pull from "effect/Pull";
import * as Queue from "effect/Queue";
import * as Semaphore from "effect/Semaphore";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import type * as MobyDemux from "../../MobyDemux.js";

import { demuxMultiplexedToSeparateSinks, isMultiplexedChannel, isMultiplexedSocket } from "./multiplexed.js";
import { makeRawChannel } from "./raw.js";

/** @internal */
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
        R
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
        R
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

        const mutex = yield* Semaphore.make(1);
        const context = yield* Effect.context<R>();

        // Internal buffers.
        const capacity = options.requestedCapacity;
        const stdoutConsumerQueue = yield* Queue.bounded<string, Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdoutCapacity
        );
        const stderrConsumerQueue = yield* Queue.bounded<string, Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stderrCapacity
        );
        const stdinProducerQueue = yield* Queue.bounded<CanReceive, IE | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdinCapacity
        );

        // We MUST only touch the underlying once!!! Very important!!!
        // Demux everything to and fro the correct places. We can touch
        // this more than once because it is wrapped with a mutex.
        const motherEffect = demuxMultiplexedToSeparateSinks(
            multiplexedInput,
            Stream.fromQueue(stdinProducerQueue),
            Sink.fromQueue(stdoutConsumerQueue),
            Sink.fromQueue(stderrConsumerQueue),
            {
                bufferSize: 32,
                encoding: options.encoding,
            }
        ).pipe(mutex.withPermitsIfAvailable(1), Effect.asVoid, Effect.provideContext(context));

        // Forwards this channel's input into the stdin producer queue,
        // propagating input errors and the end-of-input signal.
        const feedStdin = (
            upstream: Pull.Pull<Array.NonEmptyReadonlyArray<CanReceive>, IE, unknown>
        ): Effect.Effect<void> =>
            upstream.pipe(
                Effect.flatMap((chunk) => Queue.offerAll(stdinProducerQueue, chunk)),
                Effect.forever,
                Effect.catchCause((cause) =>
                    Pull.isDoneCause(cause)
                        ? Queue.end(stdinProducerQueue)
                        : Queue.failCause(stdinProducerQueue, cause as Cause.Cause<IE>)
                ),
                Effect.asVoid
            );

        // Any one of these will kick off the mother demux, but only one will
        const independentStdinChannel = Channel.fromEffectDrain(motherEffect).pipe(
            Channel.embedInput(feedStdin),
            makeRawChannel<IE, IE | OE | Schema.SchemaError, never>
        );

        // Any one of these will kick off the mother demux, but only one will
        const independentStdoutChannel = Stream.fromQueue(stdoutConsumerQueue).pipe(
            Stream.encodeText,
            Stream.toChannel,
            Channel.mergeEffect(motherEffect),
            makeRawChannel<IE, IE | OE | Schema.SchemaError, never>
        );

        // Any one of these will kick off the mother demux, but only one will
        const independentStderrChannel = Stream.fromQueue(stderrConsumerQueue).pipe(
            Stream.encodeText,
            Stream.toChannel,
            Channel.mergeEffect(motherEffect),
            makeRawChannel<IE, IE | OE | Schema.SchemaError, never>
        );

        return {
            stdin: independentStdinChannel,
            stdout: independentStdoutChannel,
            stderr: independentStderrChannel,
        };
    })
);
