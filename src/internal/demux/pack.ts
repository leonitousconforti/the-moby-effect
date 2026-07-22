import type * as Cause from "effect/Cause";
import type * as Scope from "effect/Scope";

import * as Array from "effect/Array";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Predicate from "effect/Predicate";
import * as Pull from "effect/Pull";
import * as Queue from "effect/Queue";
import * as Semaphore from "effect/Semaphore";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Socket from "effect/unstable/socket/Socket";

import type * as MobyDemux from "../../MobyDemux.js";

import { makeMultiplexedChannel, MultiplexedHeaderType } from "./multiplexed.js";
import { demuxStdioRawToSeparateSinks } from "./raw.js";

/** @internal */
export const pack = Function.dual<
    <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R1 = never,
        R2 = never,
        R3 = never,
    >(options: {
        readonly requestedCapacity:
            | number
            | {
                  readonly stdinCapacity: number;
                  readonly stdoutCapacity: number;
                  readonly stderrCapacity: number;
              };
        readonly encoding?: string | undefined;
    }) => (
        stdio: MobyDemux.HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>
    ) => Effect.Effect<
        MobyDemux.MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
        never,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R1 = never,
        R2 = never,
        R3 = never,
    >(
        stdio: MobyDemux.HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
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
        MobyDemux.MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
        never,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    (arguments_) => "stdin" in arguments_[0] || "stdout" in arguments_[0] || "stderr" in arguments_[0],
    Effect.fnUntraced(function* <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R1 = never,
        R2 = never,
        R3 = never,
    >(
        stdio: MobyDemux.HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
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
        const mutex = yield* Semaphore.make(1);
        const context = yield* Effect.context<
            Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
        >();

        const capacity = options.requestedCapacity;
        type CanReceive = Uint8Array | string | Socket.CloseEvent;
        const stdoutConsumerQueue = yield* Queue.bounded<string, Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdoutCapacity
        );
        const stderrConsumerQueue = yield* Queue.bounded<string, Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stderrCapacity
        );
        const stdinProducerQueue = yield* Queue.bounded<Uint8Array, IE1 | IE2 | IE3 | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdinCapacity
        );

        // Demux everything to and fro the correct places. We can touch
        // this more than once because it is wrapped in the mutex.
        const motherEffect = demuxStdioRawToSeparateSinks(
            stdio,
            {
                stdin: Stream.fromQueue(stdinProducerQueue) as Stream.Stream<Uint8Array, IE1, never>,
                stdout: Sink.fromQueue(stdoutConsumerQueue),
                stderr: Sink.fromQueue(stderrConsumerQueue),
            },
            {
                encoding: options?.encoding,
            }
        ).pipe(mutex.withPermitsIfAvailable(1), Effect.asVoid, Effect.provideContext(context));

        // Convert the streams to the multiplexed streams
        const textEncoder = new TextEncoder();
        const encode = Function.pipe(
            Match.type<Uint8Array | string | Socket.CloseEvent>(),
            Match.when(Predicate.isUint8Array, (data) => data),
            Match.when(Predicate.isString, (data) => textEncoder.encode(data)),
            Match.when(Socket.isCloseEvent, () => new Uint8Array()),
            Match.exhaustive
        );
        const mapOutEntry =
            (type: MultiplexedHeaderType) =>
            (data: CanReceive): Uint8Array => {
                const encoded = encode(data);
                const size = encoded.length;
                const result = new Uint8Array(8 + encoded.length);

                // Set the header
                result[0] = type;
                result[1] = 0;
                result[2] = 0;
                result[3] = 0;

                // Set the size bytes in big-endian order
                result[4] = (size >>> 24) & 0xff;
                result[5] = (size >>> 16) & 0xff;
                result[6] = (size >>> 8) & 0xff;
                result[7] = size & 0xff;

                result.set(encoded, 8);
                return result;
            };

        // Forwards this channel's input into the stdin producer queue,
        // propagating input errors and the end-of-input signal.
        const feedStdin = (
            upstream: Pull.Pull<Array.NonEmptyReadonlyArray<CanReceive>, IE1 | IE2 | IE3, unknown>
        ): Effect.Effect<void> =>
            upstream.pipe(
                Effect.flatMap((chunk) => Queue.offerAll(stdinProducerQueue, Array.map(chunk, encode))),
                Effect.forever,
                Effect.catchCause((cause) =>
                    Pull.isDoneCause(cause)
                        ? Queue.end(stdinProducerQueue)
                        : Queue.failCause(stdinProducerQueue, cause as Cause.Cause<IE1 | IE2 | IE3>)
                ),
                Effect.asVoid
            );

        const independentStdinChannel = Channel.fromEffectDrain(motherEffect).pipe(Channel.embedInput(feedStdin));

        const independentStdoutChannel = Stream.fromQueue(stdoutConsumerQueue).pipe(
            Stream.encodeText,
            Stream.map(mapOutEntry(MultiplexedHeaderType.Stdout)),
            Stream.toChannel
        );

        const independentStderrChannel = Stream.fromQueue(stderrConsumerQueue).pipe(
            Stream.encodeText,
            Stream.map(mapOutEntry(MultiplexedHeaderType.Stderr)),
            Stream.toChannel
        );

        const haltStrategy = { haltStrategy: "both" } as const;
        const mixedOutputChannel = Channel.merge(independentStdoutChannel, independentStderrChannel, haltStrategy);
        return makeMultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>(
            Channel.merge(independentStdinChannel, mixedOutputChannel, haltStrategy)
        );
    })
);
