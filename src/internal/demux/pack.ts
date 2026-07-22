import type * as Cause from "effect/Cause";
import type * as Scope from "effect/Scope";

import * as Array from "effect/Array";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Predicate from "effect/Predicate";
import * as Pull from "effect/Pull";
import * as Queue from "effect/Queue";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Socket from "effect/unstable/socket/Socket";

import type * as MobyDemux from "../../MobyDemux.js";

import { makeMultiplexedChannel, MultiplexedHeaderType } from "./multiplexed.js";
import { demuxStdioRawToSeparateSinks } from "./raw.js";

/**
 * The pack demux driver runs exactly once, forked into the caller's scope,
 * and the returned multiplexed channel is pure queue plumbing. This keeps the
 * demux deterministic - the raw stdio inputs start being consumed as soon as
 * pack is called, and there is no racing over which consumer starts the
 * driver.
 *
 * @internal
 */
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
        MobyDemux.MultiplexedChannel<IE1, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
        never,
        R1 | R2 | R3 | Scope.Scope
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
        MobyDemux.MultiplexedChannel<IE1, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
        never,
        R1 | R2 | R3 | Scope.Scope
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
        type CanReceive = Uint8Array | string | Socket.CloseEvent;
        type PackError = IE1 | IE2 | IE3 | OE1 | OE2 | OE3;

        // Internal buffers. The consumer queues carry the driver's failure so
        // that a demux error surfaces on the returned multiplexed channel.
        const capacity = options.requestedCapacity;
        const stdoutConsumerQueue = yield* Queue.bounded<string, PackError | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdoutCapacity
        );
        const stderrConsumerQueue = yield* Queue.bounded<string, PackError | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stderrCapacity
        );
        const stdinProducerQueue = yield* Queue.bounded<Uint8Array, IE1 | Cause.Done>(
            typeof capacity === "number" ? capacity : capacity.stdinCapacity
        );

        // The driver demuxes the raw stdio inputs into the consumer queues
        // and pumps the stdin producer queue into them. On completion the
        // consumer queues are ended; on failure the failure is forwarded to
        // them so it surfaces on the returned multiplexed channel.
        const driver = yield* demuxStdioRawToSeparateSinks(
            stdio,
            {
                stdin: Stream.fromQueue(stdinProducerQueue),
                stdout: Sink.forEachArray((chunk) => Queue.offerAll(stdoutConsumerQueue, chunk)),
                stderr: Sink.forEachArray((chunk) => Queue.offerAll(stderrConsumerQueue, chunk)),
            },
            {
                encoding: options?.encoding,
            }
        ).pipe(
            Effect.tap(() => Effect.andThen(Queue.end(stdoutConsumerQueue), Queue.end(stderrConsumerQueue))),
            Effect.tapCause((cause) =>
                Effect.andThen(Queue.failCause(stdoutConsumerQueue, cause), Queue.failCause(stderrConsumerQueue, cause))
            ),
            Effect.forkScoped
        );

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
            upstream: Pull.Pull<Array.NonEmptyReadonlyArray<CanReceive>, IE1, unknown, never>
        ): Effect.Effect<void> =>
            upstream.pipe(
                Effect.flatMap((chunk) => Queue.offerAll(stdinProducerQueue, Array.map(chunk, encode))),
                Effect.forever,
                Pull.catchDone(() => Queue.end(stdinProducerQueue)),
                Effect.catchCause((cause) => Queue.failCause(stdinProducerQueue, cause)),
                Effect.asVoid
            );

        // The stdin side completes (or fails) with the driver.
        const independentStdinChannel = Channel.fromEffectDrain(Fiber.join(driver)).pipe(
            Channel.embedInput<Array.NonEmptyReadonlyArray<CanReceive>, IE1, unknown, never>(feedStdin)
        );

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
        return makeMultiplexedChannel<IE1, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>(
            Channel.merge(independentStdinChannel, mixedOutputChannel, haltStrategy)
        );
    })
);
