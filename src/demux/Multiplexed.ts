/**
 * Demux utilities for multiplexed sockets. Multiplexed sockets come in a single
 * "flavor" - they are always bidirectional. You can receive data (both stdout
 * and stderr) and send data (stdin) over the same socket.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { IExposeSocketOnEffectClientResponseHack } from "../platforms/Node.js";
import { CompressedDemuxOutput, compressDemuxOutput } from "./Compressed.js";

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
 * @category Types
 */
export const MultiplexedStreamSocketContentType = "application/vnd.docker.multiplexed-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedStreamSocketTypeId: unique symbol = Symbol.for("the-moby-effect/demux/MultiplexedStreamSocket");

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedStreamSocketTypeId = typeof MultiplexedStreamSocketTypeId;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedStreamSocket = (u: unknown): u is MultiplexedStreamSocket =>
    Predicate.hasProperty(u, MultiplexedStreamSocketTypeId);

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
 * @category Predicates
 */
export const responseIsMultiplexedStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
    response.headers["content-type"] === MultiplexedStreamSocketContentType;

/**
 * Transforms an http response into a multiplexed stream socket. If the response
 * is not a multiplexed stream socket, then an error will be returned.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToMultiplexedStreamSocketOrFail = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<MultiplexedStreamSocket, Socket.SocketError, never> =>
    Effect.gen(function* () {
        if (responseIsMultiplexedStreamSocketResponse(response)) {
            const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
            const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
            const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));
            return {
                ...effectSocket,
                "content-type": MultiplexedStreamSocketContentType,
                [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId,
            };
        } else {
            return yield* new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a multiplexed streaming socket`,
            });
        }
    });

/**
 * @since 1.0.0
 * @category Demux
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
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxMultiplexedSocket = Function.dual<
    // Data last signature
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ) => (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // Data first signature
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    (arguments_) => arguments_[0][Socket.TypeId] !== undefined,
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.mapConcat(Function.identity),
            Stream.aggregate(demuxMultiplexedSocketFolderSink),
            Stream.filter(
                ([messageType]) =>
                    messageType === MultiplexedStreamSocketHeaderType.Stdout ||
                    messageType === MultiplexedStreamSocketHeaderType.Stderr
            ),
            Stream.partition(([messageType]) => messageType === MultiplexedStreamSocketHeaderType.Stderr, options),
            Effect.map(
                Tuple.mapBoth({
                    onFirst: Function.flow(Stream.map(Tuple.getSecond), Stream.decodeText("utf-8"), Stream.run(sink1)),
                    onSecond: Function.flow(Stream.map(Tuple.getSecond), Stream.decodeText("utf-8"), Stream.run(sink2)),
                })
            ),
            Effect.map(Effect.allWith({ concurrency: 2 })),
            Effect.flatten,
            Effect.map(compressDemuxOutput),
            Effect.scoped
        )
);
