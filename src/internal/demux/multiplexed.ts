import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";

import * as Socket from "@effect/platform/Socket";
import * as Channel from "effect/Channel";
import * as Chunk from "effect/Chunk";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { compressDemuxOutput, CompressedDemuxOutput } from "./compressed.js";

/**
 * @since 1.0.0
 * @category Types
 */
export const MultiplexedContentType = "application/vnd.docker.multiplexed-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedSocketTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/MultiplexedSocket"
) as MultiplexedSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedSocketTypeId = typeof MultiplexedSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedChannelTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/MultiplexedChannel"
) as MultiplexedChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedChannelTypeId = typeof MultiplexedChannelTypeId;

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
export type MultiplexedSocket = {
    readonly "content-type": typeof MultiplexedContentType;
    readonly [MultiplexedSocketTypeId]: MultiplexedSocketTypeId;
    readonly underlying: Socket.Socket;
};

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
export type MultiplexedChannel<IE = unknown, OE = Socket.SocketError, R = never> = {
    readonly "content-type": typeof MultiplexedContentType;
    readonly [MultiplexedChannelTypeId]: MultiplexedChannelTypeId;
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
 * @category Types
 */
export type EitherMultiplexedInput<IE, OE, R> = MultiplexedSocket | MultiplexedChannel<IE, OE, R>;

/**
 * @since 1.0.0
 * @category Types
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyMultiplexedInput = EitherMultiplexedInput<any, any, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeMultiplexedSocket = (underlying: Socket.Socket): MultiplexedSocket => ({
    underlying,
    "content-type": MultiplexedContentType,
    [MultiplexedSocketTypeId]: MultiplexedSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeMultiplexedChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        IE | OE,
        IE,
        void,
        unknown,
        R
    >
): MultiplexedChannel<IE, OE, R> => ({
    underlying,
    "content-type": MultiplexedContentType,
    [MultiplexedChannelTypeId]: MultiplexedChannelTypeId,
});

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedSocket = (u: unknown): u is MultiplexedSocket =>
    Predicate.hasProperty(u, MultiplexedSocketTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
): u is MultiplexedChannel<IE, OE, R> => Predicate.hasProperty(u, MultiplexedChannelTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsMultiplexedResponse = (response: HttpClientResponse.HttpClientResponse): boolean =>
    response.headers["content-type"] === MultiplexedContentType;

/**
 * @since 1.0.0
 * @category Types
 */
export enum MultiplexedHeaderType {
    Stdin = 0,
    Stdout = 1,
    Stderr = 2,
}

/**
 * @since 1.0.0
 * @category Types
 */
export type MultiplexedAccumulator = {
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
export interface $MultiplexedSchema
    extends Schema.Tuple<
        [Schema.Enums<typeof MultiplexedHeaderType>, Schema.Schema<Uint8Array, ReadonlyArray<number>, never>]
    > {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export const MultiplexedSchema: $MultiplexedSchema = Schema.Tuple(
    Schema.Enums(MultiplexedHeaderType),
    Schema.Uint8Array
);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const asMultiplexedChannel = <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherMultiplexedInput<IE, OE, R>
): MultiplexedChannel<IE, OE, R> =>
    isMultiplexedSocket(input)
        ? (makeMultiplexedChannel(Socket.toChannel<IE>(input.underlying)) as unknown as MultiplexedChannel<IE, OE, R>)
        : (input as MultiplexedChannel<IE, OE, R>);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedToStream = <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherMultiplexedInput<IE, OE, R>
): Stream.Stream<Uint8Array, IE | OE, R> =>
    Channel.toStream(
        asMultiplexedChannel(input).underlying as Channel.Channel<
            Chunk.Chunk<Uint8Array>,
            unknown,
            IE | OE,
            unknown,
            void,
            unknown,
            R
        >
    );

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedToSink = <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherMultiplexedInput<IE, OE, R>
): Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> =>
    Channel.toSink(asMultiplexedChannel(input).underlying);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedFromStreamWith =
    <IE>() =>
    <E, R>(input: Stream.Stream<Uint8Array, IE | E, R>): MultiplexedChannel<IE, E, R> =>
        makeMultiplexedChannel<IE, E, R>(Stream.toChannel(input));

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedFromStream = <E, R>(
    input: Stream.Stream<Uint8Array, E, R>
): MultiplexedChannel<unknown, E, R> => multiplexedFromStreamWith<unknown>()(input);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedFromSink = <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
): MultiplexedChannel<never, E, R> => makeMultiplexedChannel<never, E, R>(Sink.toChannel(input));

/**
 * Accumulates the header and its message bytes into a single value.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxMultiplexedFolderSink: Sink.Sink<MultiplexedAccumulator, number, number, never, never> = Sink.fold(
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
): Stream.Stream<readonly [MultiplexedHeaderType, Uint8Array], ParseResult.ParseError | E, R> =>
    Function.pipe(
        multiplexedStream,
        Stream.mapConcat(Function.identity),
        Stream.aggregateWithin(demuxMultiplexedFolderSink, Schedule.fixed(Duration.infinity)),
        Stream.map(({ messageBuffer, messageType }) => Tuple.make(messageType, Chunk.toReadonlyArray(messageBuffer))),
        Stream.flatMap(Schema.decodeUnknown(MultiplexedSchema))
    );

/**
 * Demux a multiplexed socket, all output goes to a single sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxMultiplexedToSingleSink = Function.dual<
    // One sink, data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, readonly [MultiplexedHeaderType, string], L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R3 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R3>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // One sink, data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, readonly [MultiplexedHeaderType, string], L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    (arguments_) => isMultiplexedSocket(arguments_[0]) || isMultiplexedChannel(arguments_[0]),
    (socket, source, sink, options) => {
        const { underlying } = asMultiplexedChannel(socket);
        const textDecoder = new TextDecoder(options?.encoding);
        const toStrings = Tuple.mapSecond((bytes: Uint8Array) => textDecoder.decode(bytes, { stream: true }));
        return Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(underlying),
            aggregate,
            Stream.map(toStrings),
            Stream.run(sink)
        );
    }
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
export const demuxMultiplexedToSeparateSinks = Function.dual<
    // Two sinks, data-last signature.
    <A1, A2, L1, L2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink1: Sink.Sink<A1, string, L1, E2, R2>,
        sink2: Sink.Sink<A2, string, L2, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R4 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R4>
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
    >,
    // Two sinks, data-first signature.
    <A1, A2, L1, L2, E1, E2, E3, R1, R2, R3, IE = never, OE = Socket.SocketError, R4 = never>(
        socket: EitherMultiplexedInput<E1 | IE, OE, R4>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink1: Sink.Sink<A1, string, L1, E2, R2>,
        sink2: Sink.Sink<A2, string, L2, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
    >
>(
    (arguments_) => isMultiplexedSocket(arguments_[0]) || isMultiplexedChannel(arguments_[0]),
    (socket, source, sink1, sink2, options) =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(asMultiplexedChannel(socket).underlying),
            aggregate,
            Stream.partition(([messageType]) => messageType === MultiplexedHeaderType.Stderr, {
                bufferSize: options?.bufferSize,
            }),
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
                        Stream.run(sink2)
                    ),
                })
            ),
            Effect.map(Effect.allWith({ concurrency: 2 })),
            Effect.flatten,
            Effect.map(compressDemuxOutput),
            Effect.scoped
        )
);
