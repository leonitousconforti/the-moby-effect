import type * as Scope from "effect/Scope";

import * as Socket from "@effect/platform/Socket";
import * as Channel from "effect/Channel";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Either from "effect/Either";
import * as Exit from "effect/Exit";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Queue from "effect/Queue";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import {
    makeMultiplexedChannel,
    MultiplexedChannel,
    multiplexedFromStreamWith,
    MultiplexedHeaderType,
} from "./multiplexed.js";
import { demuxStdioRawToSeparateSinks, HeterogeneousStdioRawInput } from "./raw.js";

/**
 * @since 1.0.0
 * @category Packing
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
        requestedCapacity: number;
        encoding?: string | undefined;
    }) => (
        stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>
    ) => Effect.Effect<
        MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
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
        stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
        options: { requestedCapacity: number; encoding?: string | undefined }
    ) => Effect.Effect<
        MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
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
        stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
        options: { requestedCapacity: number; encoding?: string | undefined }
    ) {
        const mutex = yield* Effect.makeSemaphore(1);
        const context = yield* Effect.context<
            Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
        >();

        const stdoutConsumerQueue = yield* Queue.bounded<string>(options.requestedCapacity);
        const stderrConsumerQueue = yield* Queue.bounded<string>(options.requestedCapacity);
        const stdinProducerQueue = yield* Queue.bounded<
            Either.Either<Chunk.Chunk<Uint8Array | string | Socket.CloseEvent>, Exit.Exit<void, IE1>>
        >(options.requestedCapacity);

        // Demux everything to and fro the correct places. We can touch
        // this more than once because it is wrapped in the mutex.
        const mother = demuxStdioRawToSeparateSinks(
            stdio,
            {
                stdin: Function.pipe(
                    Stream.fromQueue(stdinProducerQueue, { shutdown: true }),
                    Stream.map(
                        Either.match({
                            onRight: Exit.succeed,
                            onLeft: Function.flow(
                                Exit.mapBoth({
                                    onFailure: Option.some,
                                    onSuccess: Function.compose(Option.none, Exit.fail),
                                }),
                                Exit.flatten
                            ),
                        })
                    ),
                    Stream.flattenExitOption,
                    Stream.flattenChunks
                ),
                stdout: Sink.fromQueue(stdoutConsumerQueue, { shutdown: true }),
                stderr: Sink.fromQueue(stderrConsumerQueue, { shutdown: true }),
            },
            {
                encoding: options?.encoding,
            } as const
        )
            .pipe(mutex.withPermitsIfAvailable(1))
            .pipe(Effect.asVoid)
            .pipe(Channel.fromEffect)
            .pipe(Channel.provideContext(context));

        // Convert the streams to the multiplexed streams
        const textEncoder = new TextEncoder();
        const mapEntry =
            (type: MultiplexedHeaderType) =>
            (data: Uint8Array | string | Socket.CloseEvent): Uint8Array => {
                const encoded = Function.pipe(
                    Match.value(data),
                    Match.when(Predicate.isUint8Array, (data) => data),
                    Match.when(Predicate.isString, (data) => textEncoder.encode(data)),
                    Match.when(Socket.isCloseEvent, () => new Uint8Array()),
                    Match.exhaustive
                );
                const size = encoded.length;
                const header = new Uint8Array(8);
                header.set([type, 0, 0, 0]);
                header.set(new Uint8Array(new Uint32Array([size]).buffer), 4);
                return new Uint8Array([...header, ...encoded]);
            };

        const mapStdin = mapEntry(MultiplexedHeaderType.Stdin);
        const mapStdout = mapEntry(MultiplexedHeaderType.Stdout);
        const mapStderr = mapEntry(MultiplexedHeaderType.Stderr);

        const independentStdinChannel = Channel.toQueue(stdinProducerQueue)
            .pipe(Channel.mapInput(Function.constVoid))
            .pipe(Channel.mapInputError((x: IE1 | IE2 | IE3) => x))
            .pipe(
                Channel.mapInputIn((input: Chunk.Chunk<Uint8Array | string | Socket.CloseEvent>) =>
                    Chunk.map(input, mapStdin)
                )
            )
            .pipe(Channel.zipLeft(mother, { concurrent: true }));

        const { underlying: independentStdoutChannel } = Stream.fromQueue(stdoutConsumerQueue)
            .pipe(Stream.encodeText)
            .pipe(Stream.map(mapStdout))
            .pipe(multiplexedFromStreamWith<IE1 | IE2 | IE3>());

        const { underlying: independentStderrChannel } = Stream.fromQueue(stderrConsumerQueue)
            .pipe(Stream.encodeText)
            .pipe(Stream.map(mapStderr))
            .pipe(multiplexedFromStreamWith<IE1 | IE2 | IE3>());

        const mixedOutputChannel = Channel.zip(independentStdoutChannel, independentStderrChannel, {
            concurrent: true,
        });
        return makeMultiplexedChannel(Channel.zip(independentStdinChannel, mixedOutputChannel, { concurrent: true }));
    })
);
