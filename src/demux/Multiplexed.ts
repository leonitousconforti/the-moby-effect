/**
 * Demux utilities for multiplexed streams.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

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
    "content-type": typeof MultiplexedStreamSocketContentType;
} & Brand.Brand<"MultiplexedStreamSocket">;

/**
 * @since 1.0.0
 * @category Brands
 */
export const MultiplexedStreamSocket = Brand.refined<MultiplexedStreamSocket>(
    (socket) => socket["content-type"] === MultiplexedStreamSocketContentType,
    (socket) =>
        Brand.error(
            `Expected a multiplexed stream socket with content type "${MultiplexedStreamSocketContentType}", but this socket has content type ${socket["content-type"]}`
        )
);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
    response.headers["content-type"] === MultiplexedStreamSocketContentType;

/**
 * @since 1.0.0
 * @category Demux
 * @internal
 */
export const demuxMultiplexedSocketFolderSink: Sink.Sink<
    readonly [MultiplexedStreamSocketHeaderType, Uint8Array],
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
    ({ messageBytesRead, messageSize }) => messageBytesRead >= (messageSize ?? Number.MAX_SAFE_INTEGER),
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
)
    .pipe(Sink.map(({ messageBuffer, messageType }) => Tuple.make(messageType, Chunk.toReadonlyArray(messageBuffer))))
    .pipe(Sink.flatMap(Schema.decodeUnknown(MultiplexedStreamSocketSchema)));

/**
 * Demux a multiplexed socket. When given a multiplexed socket, we must parse
 * the chunks by headers and then forward each chunk based on its datatype to
 * the correct sink.
 *
 * When partitioning the stream into stdout and stderr, the first sink may
 * advance by up to bufferSize elements further than the slower one. The default
 * bufferSize is 16.
 *
 * {@link demuxSocket}
 *
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxMultiplexedSocket = Function.dual<
    <A1, A2, E1, E2, E3>(
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink1: Sink.Sink<A1, string, never, E2, never>,
        sink2: Sink.Sink<A2, string, never, E3, never>,
        options?: { bufferSize?: number | undefined } | undefined
    ) => (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        never
    >,
    <A1, A2, E1, E2, E3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink1: Sink.Sink<A1, string, never, E2, never>,
        sink2: Sink.Sink<A2, string, never, E3, never>,
        options?: { bufferSize?: number | undefined } | undefined
    ) => Effect.Effect<
        readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        never
    >
>(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined,
    <A1, A2, E1, E2, E3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink1: Sink.Sink<A1, string, never, E2, never>,
        sink2: Sink.Sink<A2, string, never, E3, never>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        readonly [stdout: A1, stderr: A2],
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        never
    > =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.mapConcat(Function.identity),
            Stream.aggregate(demuxMultiplexedSocketFolderSink),
            Stream.partition(([messageType]) => messageType === MultiplexedStreamSocketHeaderType.Stderr, options),
            Effect.map(
                Tuple.mapBoth({
                    onFirst: Function.flow(Stream.map(Tuple.getSecond), Stream.decodeText("utf-8"), Stream.run(sink1)),
                    onSecond: Function.flow(Stream.map(Tuple.getSecond), Stream.decodeText("utf-8"), Stream.run(sink2)),
                })
            ),
            Effect.map(Effect.allWith({ concurrency: 2 })),
            Effect.flatten,
            Effect.scoped
        )
);
