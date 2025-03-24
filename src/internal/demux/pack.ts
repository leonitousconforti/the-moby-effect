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
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import { type Demux } from "./demux.js";
import {
    fromStreamWith,
    makeMultiplexedStreamChannel,
    MultiplexedStreamChannel,
    MultiplexedStreamSocketHeaderType,
} from "./multiplexed.js";
import { demuxRawSockets } from "./raw.js";

/**
 * @since 1.0.0
 * @category Packing
 */
export const pack: <
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
    stdio: Demux.HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => Effect.Effect<
    MultiplexedStreamChannel<IE1, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, R1 | R2 | R3>,
    never,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
> = Effect.fnUntraced(function* <
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
    stdio: Demux.HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
    options?: { encoding?: string | undefined } | undefined
) {
    const mutex = yield* Effect.makeSemaphore(1);
    const context = yield* Effect.context<
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >();

    // TODO: These are memory leaks, can we make them configurable bounded queues?
    const stdoutConsumerQueue = yield* Queue.unbounded<string>();
    const stderrConsumerQueue = yield* Queue.unbounded<string>();
    const stdinProducerQueue =
        yield* Queue.unbounded<
            Either.Either<Chunk.Chunk<Uint8Array | string | Socket.CloseEvent>, Exit.Exit<void, IE1>>
        >();

    // Demux everything to and fro the correct places. We can touch
    // this more than once because it is wrapped in the mutex.
    const mother = demuxRawSockets(
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
        options
    )
        .pipe(mutex.withPermitsIfAvailable(1))
        .pipe(Effect.asVoid)
        .pipe(Channel.fromEffect)
        .pipe(Channel.provideContext(context));

    // Convert the streams to the multiplexed streams
    const textEncoder = new TextEncoder();
    const mapEntry =
        (type: MultiplexedStreamSocketHeaderType) =>
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

    const mapStdin = mapEntry(MultiplexedStreamSocketHeaderType.Stdin);
    const mapStdout = mapEntry(MultiplexedStreamSocketHeaderType.Stdout);
    const mapStderr = mapEntry(MultiplexedStreamSocketHeaderType.Stderr);

    const independentStdinChannel = Channel.toQueue(stdinProducerQueue)
        .pipe(Channel.mapInput(Function.constVoid))
        .pipe(Channel.mapInputIn((input: Uint8Array | string | Socket.CloseEvent) => Chunk.of(mapStdin(input))))
        .pipe(Channel.zipLeft(mother, { concurrent: true }));

    const { underlying: independentStdoutChannel } = Stream.fromQueue(stdoutConsumerQueue)
        .pipe(Stream.encodeText)
        .pipe(Stream.map(mapStdout))
        .pipe(fromStreamWith<IE2>());

    const { underlying: independentStderrChannel } = Stream.fromQueue(stderrConsumerQueue)
        .pipe(Stream.encodeText)
        .pipe(Stream.map(mapStderr))
        .pipe(fromStreamWith<IE3>());

    const outputChannel = Channel.zip(independentStdoutChannel, independentStderrChannel, { concurrent: true });

    const a = Channel.zip(independentStdinChannel, outputChannel, { concurrent: true });
    const b = makeMultiplexedStreamChannel<IE1, IE2 | IE3 | OE1 | OE2 | OE3, never>(a);

    return {} as MultiplexedStreamChannel<IE1, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, R1 | R2 | R3>;
});
