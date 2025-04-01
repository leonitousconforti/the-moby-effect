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
    demuxMultiplexedToSeparateSinks,
    EitherMultiplexedInput,
    isMultiplexedChannel,
    isMultiplexedSocket,
    MultiplexedChannel,
    MultiplexedSocket,
} from "./multiplexed.js";
import { makeRawChannel, RawChannel, rawFromStreamWith } from "./raw.js";

/**
 * @since 1.0.0
 * @category Fanning
 */
export const fan = Function.dual<
    <IE = never, OE = Socket.SocketError, R = never>(options: {
        requestedCapacity: number;
        encoding?: string | undefined;
    }) => (multiplexedInput: EitherMultiplexedInput<IE, OE, R>) => Effect.Effect<
        {
            stdin: RawChannel<IE, OE | ParseResult.ParseError, never>;
            stdout: RawChannel<IE, OE | ParseResult.ParseError, never>;
            stderr: RawChannel<IE, OE | ParseResult.ParseError, never>;
        },
        never,
        Exclude<R, Scope.Scope>
    >,
    <IE = never, OE = Socket.SocketError, R = never>(
        multiplexedInput: EitherMultiplexedInput<IE, OE, R>,
        options: { requestedCapacity: number; encoding?: string | undefined }
    ) => Effect.Effect<
        {
            stdin: RawChannel<IE, OE | ParseResult.ParseError, never>;
            stdout: RawChannel<IE, OE | ParseResult.ParseError, never>;
            stderr: RawChannel<IE, OE | ParseResult.ParseError, never>;
        },
        never,
        Exclude<R, Scope.Scope>
    >
>(
    (arguments_) => isMultiplexedChannel(arguments_[0]) || isMultiplexedSocket(arguments_[0]),
    Effect.fnUntraced(function* <IE = never, OE = Socket.SocketError, R = never>(
        multiplexedInput: MultiplexedSocket | MultiplexedChannel<IE, OE, R>,
        options: { requestedCapacity: number; encoding?: string | undefined }
    ) {
        const mutex = yield* Effect.makeSemaphore(1);
        const context = yield* Effect.context<Exclude<R, Scope.Scope>>();

        // Internal buffers
        const stdoutConsumerQueue = yield* Queue.bounded<string>(options.requestedCapacity);
        const stderrConsumerQueue = yield* Queue.bounded<string>(options.requestedCapacity);
        const stdinProducerQueue = yield* Queue.bounded<
            Either.Either<Chunk.Chunk<Uint8Array | string | Socket.CloseEvent>, Exit.Exit<void, IE>>
        >(options.requestedCapacity);

        // We MUST only touch the underlying once!!! Very important!!!
        // Demux everything to and fro the correct places. We can touch
        // this more than once because it is wrapped with a mutex.
        const motherChannel = demuxMultiplexedToSeparateSinks(
            multiplexedInput,
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
            {
                bufferSize: 32,
                encoding: options.encoding,
            }
        )
            .pipe(mutex.withPermitsIfAvailable(1))
            .pipe(Effect.asVoid)
            .pipe(Channel.fromEffect)
            .pipe(Channel.provideContext(context));

        // Any one of these will kick off the mother demux, but only one will
        const independentStdinChannel = Channel.toQueue(stdinProducerQueue)
            .pipe(Channel.mapInput(Function.constVoid))
            .pipe(Channel.zipLeft(motherChannel, { concurrent: true }))
            .pipe(makeRawChannel<IE, OE | ParseResult.ParseError, never>);

        // Any one of these will kick off the mother demux, but only one will
        const independentStdoutChannel = Stream.fromQueue(stdoutConsumerQueue)
            .pipe(Stream.encodeText)
            .pipe(rawFromStreamWith<IE>())
            .pipe(({ underlying }) => underlying)
            .pipe(Channel.zipLeft(motherChannel, { concurrent: true }))
            .pipe(makeRawChannel<IE, OE | ParseResult.ParseError, never>);

        // Any one of these will kick off the mother demux, but only one will
        const independentStderrChannel = Stream.fromQueue(stderrConsumerQueue)
            .pipe(Stream.encodeText)
            .pipe(rawFromStreamWith<IE>())
            .pipe(({ underlying }) => underlying)
            .pipe(Channel.zipLeft(motherChannel, { concurrent: true }))
            .pipe(makeRawChannel<IE, OE | ParseResult.ParseError, never>);

        return {
            stdin: independentStdinChannel,
            stdout: independentStdoutChannel,
            stderr: independentStderrChannel,
        };
    })
);
