/**
 * Demux utilities for multiplexed sockets. You can receive data (both stdout
 * and stderr) distinctly and send data (stdin) all over the same socket.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
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

import { CompressedDemuxOutput, compressDemuxOutput } from "./Compressed.js";

/**
 * @since 1.0.0
 * @category Types
 * @internal
 */
export enum MultiplexedStreamSocketHeaderType {
    Stdin = 0,
    Stdout = 1,
    Stderr = 2,
}

/**
 * @since 1.0.0
 * @category Types
 * @internal
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
 * @internal
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
 * @internal
 */
export const MultiplexedStreamSocketSchema: $MultiplexedStreamSocketSchema = Schema.Tuple(
    Schema.Enums(MultiplexedStreamSocketHeaderType),
    Schema.Uint8Array
);

/**
 * @since 1.0.0
 * @category Types
 * @internal
 */
export const MultiplexedStreamSocketContentType = "application/vnd.docker.multiplexed-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 * @internal
 */
export const MultiplexedStreamSocketTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/MultiplexedStreamSocket"
) as MultiplexedStreamSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 * @internal
 */
export type MultiplexedStreamSocketTypeId = typeof MultiplexedStreamSocketTypeId;

/**
 * When the TTY setting is disabled in POST /containers/create, the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out stdout
 * and stderr. The stream consists of a series of frames, each containing a
 * header and a payload.
 *
 * @since 1.0.0
 * @category Types
 */
export type MultiplexedStreamSocket = Socket.Socket & {
    readonly "content-type": typeof MultiplexedStreamSocketContentType;
    readonly [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId;
};

/**
 * @since 1.0.0
 * @category Constructors
 * @internal
 */
export const makeMultiplexedStreamSocket = (socket: Socket.Socket): MultiplexedStreamSocket => ({
    ...socket,
    "content-type": MultiplexedStreamSocketContentType,
    [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId,
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
 * @internal
 */
export const responseIsMultiplexedStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
    response.headers["content-type"] === MultiplexedStreamSocketContentType;

/**
 * Accumulates the header and its message bytes into a single value.
 *
 * @since 1.0.0
 * @category Demux
 * @internal
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
    <A1, E1, E2, R1, R2>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, never>,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // One sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, never>,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;

    // Two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined,
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2OrOptions?: Sink.Sink<A2, string, string, E3, R3> | { encoding: string | undefined } | undefined,
        options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        const willPartition = Predicate.hasProperty(sink2OrOptions, Sink.SinkTypeId);
        const untilPartition = Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.mapConcat(Function.identity),
            Stream.aggregateWithin(demuxMultiplexedSocketFolderSink, Schedule.fixed(Duration.infinity)),
            Stream.map(({ messageBuffer, messageType }) =>
                Tuple.make(messageType, Chunk.toReadonlyArray(messageBuffer))
            ),
            Stream.flatMap(Schema.decodeUnknown(MultiplexedStreamSocketSchema))
        );

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
            Stream.partition(([messageType]) => messageType === MultiplexedStreamSocketHeaderType.Stderr, {
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
