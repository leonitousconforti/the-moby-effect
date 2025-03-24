/**
 * Demux utilities for multiplexed sockets. You can receive data (both stdout
 * and stderr) distinctly and send data (stdin) all over the same socket.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Channel from "effect/Channel";
import * as Chunk from "effect/Chunk";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { compressDemuxOutput, CompressedDemuxOutput } from "./compressed.js";

/**
 * @since 1.0.0
 * @category Types
 */
export const MultiplexedStreamContentType = "application/vnd.docker.multiplexed-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedStreamSocketTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/MultiplexedStreamSocket"
) as MultiplexedStreamSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedStreamSocketTypeId = typeof MultiplexedStreamSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedStreamChannelTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/MultiplexedStreamChannel"
) as MultiplexedStreamChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedStreamChannelTypeId = typeof MultiplexedStreamChannelTypeId;

/**
 * When the TTY setting is disabled in POST /containers/create, the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out stdout
 * and stderr. The stream consists of a series of frames, each containing a
 * header and a payload.
 *
 * Note for Leo: This exists because the input error type "IE" might not be
 * known at the time of converting the Socket to a Channel.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type MultiplexedStreamSocket = {
    readonly "content-type": typeof MultiplexedStreamContentType;
    readonly [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId;
    readonly underlying: Socket.Socket;
};

/**
 * @since 1.0.0
 * @category Types
 */
export type EitherMultiplexedInput<IE, OE, R> = MultiplexedStreamSocket | MultiplexedStreamChannel<IE, OE, R>;

/**
 * @since 1.0.0
 * @category Types
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyMultiplexedInput = EitherMultiplexedInput<any, any, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * When the TTY setting is disabled in POST /containers/create, the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out stdout
 * and stderr. The stream consists of a series of frames, each containing a
 * header and a payload.
 *
 * Note for Leo: This exists because there is no way to convert from a Channel
 * to a Socket. In fact, with my current effect knowledge, I believe it is
 * impossible to implement. This is still needed though for the pack and fan
 * implementations which seek to return these types.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type MultiplexedStreamChannel<IE = unknown, OE = Socket.SocketError, R = never> = {
    readonly "content-type": typeof MultiplexedStreamContentType;
    readonly [MultiplexedStreamChannelTypeId]: MultiplexedStreamChannelTypeId;
    readonly underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        IE | OE,
        IE,
        void,
        unknown,
        R
    >;
};

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeMultiplexedStreamSocket = (underlying: Socket.Socket): MultiplexedStreamSocket => ({
    underlying,
    "content-type": MultiplexedStreamContentType,
    [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeMultiplexedStreamChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        IE | OE,
        IE,
        void,
        unknown,
        R
    >
): MultiplexedStreamChannel<IE, OE, R> => ({
    underlying,
    "content-type": MultiplexedStreamContentType,
    [MultiplexedStreamChannelTypeId]: MultiplexedStreamChannelTypeId,
});

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedStreamSocket = (u: unknown): u is MultiplexedStreamSocket =>
    Predicate.hasProperty(u, MultiplexedStreamSocketTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedStreamChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
): u is MultiplexedStreamChannel<IE, OE, R> => Predicate.hasProperty(u, MultiplexedStreamChannelTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsMultiplexedStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse): boolean =>
    response.headers["content-type"] === MultiplexedStreamContentType;

/**
 * @since 1.0.0
 * @category Types
 */
export enum MultiplexedStreamSocketHeaderType {
    Stdin = 0,
    Stdout = 1,
    Stderr = 2,
}

/**
 * @since 1.0.0
 * @category Types
 */
export type MultiplexedStreamSocketAccumulator = {
    headerBytesRead: number;
    messageBytesRead: number;
    headerBuffer: Chunk.Chunk<number>;
    messageBuffer: Chunk.Chunk<number>;
    messageSize: number | undefined;
    messageType: number | undefined;
};

/**
 * @since 1.0.0
 * @category Types
 */
export interface $MultiplexedStreamSocketSchema
    extends Schema.Tuple<
        [
            Schema.Enums<typeof MultiplexedStreamSocketHeaderType>,
            Schema.Schema<Uint8Array, ReadonlyArray<number>, never>,
        ]
    > {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export const MultiplexedStreamSocketSchema: $MultiplexedStreamSocketSchema = Schema.Tuple(
    Schema.Enums(MultiplexedStreamSocketHeaderType),
    Schema.Uint8Array
);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const asMultiplexedStreamChannel = <IE>(
    input: MultiplexedStreamSocket
): MultiplexedStreamChannel<IE, Socket.SocketError, never> =>
    makeMultiplexedStreamChannel<IE, Socket.SocketError, never>(Socket.toChannel<IE>(input.underlying));

/**
 * @since 1.0.0
 * @category Conversions
 */
export const toStream = <IE, OE, R>(
    input: MultiplexedStreamChannel<IE, OE, R>
): Stream.Stream<Uint8Array, IE | OE, R> =>
    Channel.toStream(
        input.underlying as Channel.Channel<Chunk.Chunk<Uint8Array>, unknown, IE | OE, unknown, void, unknown, R>
    );

/**
 * @since 1.0.0
 * @category Conversions
 */
export const toSink = <IE, OE, R>(
    input: MultiplexedStreamChannel<IE, OE, R>
): Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> => Channel.toSink(input.underlying);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const fromStreamWith =
    <IE>() =>
    <E, R>(input: Stream.Stream<Uint8Array, IE | E, R>): MultiplexedStreamChannel<IE, E, R> =>
        makeMultiplexedStreamChannel<IE, E, R>(Stream.toChannel(input));

/**
 * @since 1.0.0
 * @category Conversions
 */
export const fromStream = <E, R>(input: Stream.Stream<Uint8Array, E, R>): MultiplexedStreamChannel<unknown, E, R> =>
    fromStreamWith<unknown>()(input);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const fromSink = <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
): MultiplexedStreamChannel<never, E, R> => makeMultiplexedStreamChannel<never, E, R>(Sink.toChannel(input));

/**
 * Accumulates the header and its message bytes into a single value.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxMultiplexedSocketFolderSink: Sink.Sink<
    MultiplexedStreamSocketAccumulator,
    number,
    number,
    ParseResult.ParseError,
    never
> = Sink.fold(
    {
        headerBytesRead: 0,
        messageBytesRead: 0,
        headerBuffer: Chunk.empty<number>(),
        messageBuffer: Chunk.empty<number>(),
        messageSize: undefined as number | undefined,
        messageType: undefined as number | undefined,
    },
    ({ messageBytesRead, messageSize }) => messageSize === undefined || messageBytesRead < messageSize,
    (accumulator, input: number) => {
        // If we have not read the entire header yet
        if (accumulator.headerBytesRead < 8) {
            return {
                ...accumulator,
                headerBytesRead: accumulator.headerBytesRead + 1,
                headerBuffer: Chunk.append(accumulator.headerBuffer, input),
            };
        }

        // Lazily evaluate the header and message size
        const uint8Array = () => new Uint8Array(Chunk.toReadonlyArray(accumulator.headerBuffer));
        const type = () => accumulator.messageType ?? new DataView(uint8Array().buffer).getUint8(0);
        const size = () => accumulator.messageSize ?? new DataView(uint8Array().buffer).getUint32(4);

        // We can parse the header when we've read all 8 bytes and haven't parsed it yet
        const needToParseHeader =
            accumulator.headerBytesRead === 8 &&
            Predicate.isUndefined(accumulator.messageType) &&
            Predicate.isUndefined(accumulator.messageSize);

        // Otherwise, if we have read the entire header but not parsed it yet
        const parsedHeader = needToParseHeader ? { messageType: type(), messageSize: size() } : {};
        return {
            ...accumulator,
            ...parsedHeader,
            messageBytesRead: accumulator.messageBytesRead + 1,
            messageBuffer: Chunk.append(accumulator.messageBuffer, input),
        };
    }
);

/**
 * @since 1.0.0
 * @category Grouping
 */
export const aggregate = <E, R>(
    multiplexedStream: Stream.Stream<Uint8Array, E, R>
): Stream.Stream<readonly [MultiplexedStreamSocketHeaderType, Uint8Array], ParseResult.ParseError | E, R> =>
    Function.pipe(
        multiplexedStream,
        Stream.mapConcat(Function.identity),
        Stream.aggregateWithin(demuxMultiplexedSocketFolderSink, Schedule.fixed(Duration.infinity)),
        Stream.map(({ messageBuffer, messageType }) => Tuple.make(messageType, Chunk.toReadonlyArray(messageBuffer))),
        Stream.flatMap(Schema.decodeUnknown(MultiplexedStreamSocketSchema))
    );

/**
 * Demux a multiplexed socket. When given a multiplexed socket, we must parse
 * the chunks by headers and then forward each chunk based on its datatype to
 * the correct sink.
 *
 * When partitioning the stream into stdout and stderr, the first sink may
 * advance by up to bufferSize elements further than the slower one. The default
 * bufferSize is 16.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxMultiplexedSocket: {
    // One sink, data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, never>,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // One sink, data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): <IE = never, OE = Socket.SocketError, R3 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R3>
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, never>,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;

    // Two sinks, data-first signature.
    <A1, A2, L1, L2, E1, E2, E3, R1, R2, R3, IE = never, OE = Socket.SocketError, R4 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R4>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink1: Sink.Sink<A1, string, L1, E2, R2>,
        sink2: Sink.Sink<A2, string, L2, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
    >;
    // Two sinks, data-last signature.
    <A1, A2, L1, L2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink1: Sink.Sink<A1, string, L1, E2, R2>,
        sink2: Sink.Sink<A2, string, L2, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): <IE = never, OE = Socket.SocketError, R4 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R4>
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => isMultiplexedStreamSocket(arguments_[0]) || isMultiplexedStreamChannel(arguments_[0]),
    <A1, A2, L1, L2, E1, E2, E3, R1, R2, R3, IE = never, OE = Socket.SocketError, R4 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R4>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink1: Sink.Sink<A1, string, L1, E2, R2>,
        sink2OrOptions?: Sink.Sink<A2, string, L2, E3, R3> | { encoding: string | undefined } | undefined,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
    > => {
        const partitionOptions = { bufferSize: options?.bufferSize } as const;
        const willPartition = Predicate.hasProperty(sink2OrOptions, Sink.SinkTypeId);

        const { underlying } = isMultiplexedStreamChannel<E1 | IE, OE, R4>(socket)
            ? (socket as MultiplexedStreamChannel<E1 | IE, OE, R4>)
            : (asMultiplexedStreamChannel<E1 | IE>(socket) as unknown as MultiplexedStreamChannel<E1 | IE, OE, R4>);

        const untilPartition = Function.pipe(source, Stream.pipeThroughChannelOrFail(underlying), aggregate);

        if (!willPartition) {
            return Function.pipe(
                untilPartition,
                Stream.map(Tuple.getSecond),
                Stream.decodeText(sink2OrOptions?.encoding),
                Stream.run(sink1)
            );
        }

        return Function.pipe(
            untilPartition,
            Stream.partition(
                ([messageType]) => messageType === MultiplexedStreamSocketHeaderType.Stderr,
                partitionOptions
            ),
            Effect.map(
                Tuple.mapBoth({
                    onFirst: Function.flow(
                        Stream.map(Tuple.getSecond),
                        Stream.decodeText(options?.encoding),
                        Stream.run(sink1)
                    ),
                    onSecond: Function.flow(
                        Stream.map(Tuple.getSecond),
                        Stream.decodeText(options?.encoding),
                        Stream.run(sink2OrOptions)
                    ),
                })
            ),
            Effect.map(Effect.allWith({ concurrency: 2 })),
            Effect.flatten,
            Effect.map(compressDemuxOutput),
            Effect.scoped
        );
    }
);
