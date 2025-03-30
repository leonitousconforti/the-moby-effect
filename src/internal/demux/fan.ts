import type * as Socket from "@effect/platform/Socket";
import type * as Chunk from "effect/Chunk";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";

import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Either from "effect/Either";
import * as Exit from "effect/Exit";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Queue from "effect/Queue";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import {
    asMultiplexedChannel,
    demuxMultiplexedToSeparateSinks,
    EitherMultiplexedInput,
    isMultiplexedChannel,
    MultiplexedChannel,
    MultiplexedSocket,
} from "./multiplexed.js";
import { makeRawChannel, RawChannel, rawFromStreamWith } from "./raw.js";

/**
 * @since 1.0.0
 * @category Fanning
 */
export const fan: <IE = never, OE = Socket.SocketError, R = never>(
    multiplexedInput: EitherMultiplexedInput<IE, OE, R>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => Effect.Effect<
    {
        stdin: RawChannel<IE, OE | ParseResult.ParseError, never>;
        stdout: RawChannel<IE, OE | ParseResult.ParseError, never>;
        stderr: RawChannel<IE, OE | ParseResult.ParseError, never>;
    },
    never,
    Exclude<R, Scope.Scope>
> = Effect.fnUntraced(function* <IE = never, OE = Socket.SocketError, R = never>(
    multiplexedInput: MultiplexedSocket | MultiplexedChannel<IE, OE, R>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) {
    const mutex = yield* Effect.makeSemaphore(1);
    const context = yield* Effect.context<Exclude<R, Scope.Scope>>();

    // TODO: These are memory leaks, can we make them configurable bounded queues?
    const stdoutConsumerQueue = yield* Queue.unbounded<string>();
    const stderrConsumerQueue = yield* Queue.unbounded<string>();
    const stdinProducerQueue =
        yield* Queue.unbounded<
            Either.Either<Chunk.Chunk<Uint8Array | string | Socket.CloseEvent>, Exit.Exit<void, IE>>
        >();

    // We MUST only touch the underlying once!!! Very important!!!
    const underlying = isMultiplexedChannel<IE, OE, R>(multiplexedInput)
        ? (multiplexedInput as MultiplexedChannel<IE, OE, R>)
        : (asMultiplexedChannel<IE>(multiplexedInput) as unknown as MultiplexedChannel<IE, OE, R>);

    // Demux everything to and fro the correct places. We can touch
    // this more than once because it is wrapped with a mutex.
    const motherChannel = demuxMultiplexedToSeparateSinks(
        underlying,
        Function.pipe(
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
        Sink.fromQueue(stdoutConsumerQueue, { shutdown: true }),
        Sink.fromQueue(stderrConsumerQueue, { shutdown: true }),
        options
    )
        .pipe(mutex.withPermitsIfAvailable(1))
        .pipe(Effect.asVoid)
        .pipe(Channel.fromEffect)
        .pipe(Channel.provideContext(context));

    // Helper because we can't .pipe RawStreamChannels
    const fromStreamAsChannel = Function.compose(rawFromStreamWith<IE>(), ({ underlying }) => underlying);

    // Any one of these will kick off the mother demux, but only one will
    const independentStdinChannel = Channel.toQueue(stdinProducerQueue)
        .pipe(Channel.mapInput(Function.constVoid))
        .pipe(Channel.zipLeft(motherChannel, { concurrent: true }))
        .pipe(makeRawChannel<IE, OE | ParseResult.ParseError, never>);

    // Any one of these will kick off the mother demux, but only one will
    const independentStdoutChannel = Stream.fromQueue(stdoutConsumerQueue)
        .pipe(Stream.encodeText)
        .pipe(fromStreamAsChannel)
        .pipe(Channel.zipLeft(motherChannel, { concurrent: true }))
        .pipe(makeRawChannel<IE, OE | ParseResult.ParseError, never>);

    // Any one of these will kick off the mother demux, but only one will
    const independentStderrChannel = Stream.fromQueue(stderrConsumerQueue)
        .pipe(Stream.encodeText)
        .pipe(fromStreamAsChannel)
        .pipe(Channel.zipLeft(motherChannel, { concurrent: true }))
        .pipe(makeRawChannel<IE, OE | ParseResult.ParseError, never>);

    return {
        stdin: independentStdinChannel,
        stdout: independentStdoutChannel,
        stderr: independentStderrChannel,
    };
});
