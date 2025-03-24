/**
 * Demux utilities for raw sockets. Unlike multiplexed sockets, raw sockets can
 * not differentiate between stdout and stderr because the data is just raw
 * bytes from the process's PTY. However, you can attach multiple raw sockets to
 * the same container (one for stdout and one for stderr) and then use the demux
 * utilities to separate the streams.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Channel from "effect/Channel";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { compressDemuxOutput, type CompressedDemuxOutput } from "./compressed.js";
import { type Demux } from "./demux.js";

/**
 * @since 1.0.0
 * @category Types
 */
export const RawStreamContentType = "application/vnd.docker.raw-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const RawStreamSocketTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/RawStreamSocket"
) as RawStreamSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type RawStreamSocketTypeId = typeof RawStreamSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const RawStreamChannelTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/RawStreamChannel"
) as RawStreamChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type RawStreamChannelTypeId = typeof RawStreamChannelTypeId;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type RawStreamSocket = {
    readonly "content-type": typeof RawStreamContentType;
    readonly [RawStreamSocketTypeId]: typeof RawStreamSocketTypeId;
    readonly underlying: Socket.Socket;
};

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type RawStreamChannel<IE = unknown, OE = Socket.SocketError, R = never> = {
    readonly "content-type": typeof RawStreamContentType;
    readonly [RawStreamChannelTypeId]: typeof RawStreamChannelTypeId;
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
export const makeRawStreamSocket = (underlying: Socket.Socket): RawStreamSocket => ({
    underlying,
    "content-type": RawStreamContentType,
    [RawStreamSocketTypeId]: RawStreamSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeRawStreamChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        IE | OE,
        IE,
        void,
        unknown,
        R
    >
): RawStreamChannel<IE, OE, R> => ({
    underlying,
    "content-type": RawStreamContentType,
    [RawStreamChannelTypeId]: RawStreamChannelTypeId,
});

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawStreamSocket = (u: unknown): u is RawStreamSocket => Predicate.hasProperty(u, RawStreamSocketTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawStreamChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
): u is RawStreamChannel<IE, OE, R> => Predicate.hasProperty(u, RawStreamChannelTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsRawStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse): boolean =>
    response.headers["content-type"] === RawStreamContentType;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const asRawStreamChannel = <IE>(input: RawStreamSocket): RawStreamChannel<IE, Socket.SocketError, never> =>
    makeRawStreamChannel<IE, Socket.SocketError, never>(Socket.toChannel<IE>(input.underlying));

/**
 * @since 1.0.0
 * @category Conversions
 */
export const toStream = <IE, OE, R>(input: RawStreamChannel<IE, OE, R>): Stream.Stream<Uint8Array, IE | OE, R> =>
    Channel.toStream(
        input.underlying as Channel.Channel<Chunk.Chunk<Uint8Array>, unknown, IE | OE, unknown, void, unknown, R>
    );

/**
 * @since 1.0.0
 * @category Conversions
 */
export const toSink = <IE, OE, R>(
    input: RawStreamChannel<IE, OE, R>
): Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> => Channel.toSink(input.underlying);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const fromStreamWith =
    <IE>() =>
    <E, R>(input: Stream.Stream<Uint8Array, IE | E, R>): RawStreamChannel<IE, E, R> =>
        makeRawStreamChannel<IE, E, R>(Stream.toChannel(input));

/**
 * @since 1.0.0
 * @category Conversions
 */
export const fromStream = <E, R>(input: Stream.Stream<Uint8Array, E, R>): RawStreamChannel<unknown, E, R> =>
    fromStreamWith<unknown>()(input);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const fromSink = <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
): RawStreamChannel<never, E, R> => makeRawStreamChannel<never, E, R>(Sink.toChannel(input));

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * To demux multiple raw sockets, you should use {@link demuxRawSockets}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxRawSocket = Function.dual<
    // Data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, never, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R3 = never>(
        socket: RawStreamSocket | RawStreamChannel<E1 | IE, OE, R3>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // Data-first signature.
    <A1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socket: RawStreamSocket | RawStreamChannel<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, never, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    (arguments_) => isRawStreamSocket(arguments_[0]) || isRawStreamChannel(arguments_[0]),
    <A1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socket: RawStreamSocket | RawStreamChannel<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, never, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | IE | OE,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        const { underlying } = isRawStreamSocket(socket)
            ? (asRawStreamChannel<E1 | IE>(socket) as unknown as RawStreamChannel<IE | E1, OE, R3>)
            : (socket as RawStreamChannel<IE | E1, OE, R3>);

        return Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(underlying),
            Stream.decodeText(options?.encoding),
            Stream.run(sink)
        );
    }
);

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSocket}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSocket}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxRawSockets: {
    // Multiple sinks, data-first combined signature.
    <
        O1 extends readonly [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, unknown, unknown>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Demux.AnyRawInput<any, any, any>,
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        O2 extends readonly [Demux.AnyRawInput<any, any, any>, Sink.Sink<unknown, string, never, unknown, unknown>],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        O3 extends readonly [Demux.AnyRawInput<any, any, any>, Sink.Sink<unknown, string, never, unknown, unknown>],
        E1 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer E, infer _R1>,
            Demux.AnyRawInput<infer E | infer _IE, infer _OE, infer _R2>,
        ]
            ? E
            : never,
        E2 = O2 extends [
            Demux.AnyRawInput<infer _IE | E1, infer _OE, infer _R1>,
            Sink.Sink<infer _A, string, never, infer E, infer _R2>,
        ]
            ? E
            : never,
        E3 = O3 extends [
            Demux.AnyRawInput<infer _IE | E1, infer _OE, infer _R1>,
            Sink.Sink<infer _A, string, never, infer E, infer _R2>,
        ]
            ? E
            : never,
        IE1 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer _R1>,
            RawStreamChannel<infer _E | infer IE, infer _OE, infer _R2>,
        ]
            ? IE
            : never,
        IE2 = O2 extends [
            RawStreamChannel<E1 | infer IE, infer _OE, infer _R1>,
            Sink.Sink<infer _A, string, never, infer _E, infer _R2>,
        ]
            ? IE
            : never,
        IE3 = O3 extends [
            RawStreamChannel<E1 | infer IE, infer _OE, infer _R1>,
            Sink.Sink<infer _A, string, never, infer _E, infer _R2>,
        ]
            ? IE
            : never,
        OE1 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer _R1>,
            RawStreamChannel<infer _E | infer _IE, infer OE, infer _R2>,
        ]
            ? OE
            : Socket.SocketError,
        OE2 = O2 extends [
            RawStreamChannel<infer _E | infer _IE, infer OE, infer _R1>,
            Sink.Sink<infer _A, string, never, infer _E, infer _R2>,
        ]
            ? OE
            : Socket.SocketError,
        OE3 = O3 extends [
            RawStreamChannel<infer _E | infer _IE, infer OE, infer _R1>,
            Sink.Sink<infer _A, string, never, infer _E, infer _R2>,
        ]
            ? OE
            : Socket.SocketError,
        R1 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer R>,
            Demux.AnyRawInput<infer _E | infer _IE, infer _OE, infer _R>,
        ]
            ? R
            : never,
        R2 = O2 extends [
            Demux.AnyRawInput<infer _E | infer _IE, infer _OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        R3 = O3 extends [
            Demux.AnyRawInput<infer _E | infer _IE, infer _OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        R4 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer _R>,
            RawStreamChannel<infer _E | infer _IE, infer _OE, infer R>,
        ]
            ? R
            : never,
        R5 = O2 extends [
            RawStreamChannel<infer _E | infer _IE, infer _OE, infer R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        R6 = O3 extends [
            RawStreamChannel<infer _IE, infer _OE, infer R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        A1 = O2 extends [
            Demux.AnyRawInput<infer _IE, infer _OE, infer _R>,
            Sink.Sink<infer A, string, never, infer _E, infer _R>,
        ]
            ? A
            : void,
        A2 = O3 extends [
            Demux.AnyRawInput<infer _IE, infer _OE, infer _R>,
            Sink.Sink<infer A, string, never, infer _E, infer _R>,
        ]
            ? A
            : void,
    >(
        sockets:
            | { stdin: O1; stdout?: never; stderr?: never }
            | { stdin?: never; stdout: O2; stderr?: never }
            | { stdin?: never; stdout?: never; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr?: never }
            | { stdin: O1; stdout?: never; stderr: O3 }
            | { stdin?: never; stdout: O2; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr: O3 },
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    >;

    // Multiple sinks, data-first signature.
    <
        A1,
        A2,
        E1,
        E2,
        E3,
        R1,
        R2,
        R3,
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R4 = never,
        R5 = never,
        R6 = never,
    >(
        sockets: Demux.HeterogeneousStdioRawInput<E1 | IE1, E2 | IE2, E3 | IE3, OE1, OE2, OE3, R4, R5, R6>,
        io: {
            stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
            stdout: Sink.Sink<A1, string, never, E2, R2>;
            stderr: Sink.Sink<A2, string, never, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    >;
    // Multiple sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        io: {
            stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
            stdout: Sink.Sink<A1, string, never, E2, R2>;
            stderr: Sink.Sink<A2, string, never, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ): <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R4 = never,
        R5 = never,
        R6 = never,
    >(
        sockets: Demux.HeterogeneousStdioRawInput<IE1 | E1, IE2 | E2, IE3 | E3, OE1, OE2, OE3, R4, R5, R6>
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    >;

    // Single sink, data-first signature.
    <
        A1,
        E1,
        E2,
        E3,
        R1,
        R2,
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R3 = never,
        R4 = never,
        R5 = never,
    >(
        sockets: Demux.HeterogeneousStdioRawInput<IE1 | E1, IE2 | E2, IE3 | E3, OE1, OE2, OE3, R3, R4, R5>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, never, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
    >;
    // Single sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, never, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        E3 = Socket.SocketError,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R4 = never,
        R5 = never,
        R6 = never,
    >(
        sockets: Demux.HeterogeneousStdioRawInput<IE1 | E1, IE2 | E2, IE3 | E3, OE1, OE2, OE3, R4, R5, R6>
    ) => Effect.Effect<
        A1,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    >;
} = Function.dual(
    (arguments_) =>
        !(
            arguments_[0][Stream.StreamTypeId] !== undefined ||
            ("stdin" in arguments_[0] && arguments_[0]["stdin"]?.[Stream.StreamTypeId] !== undefined)
        ),
    <
        O1 extends readonly [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, unknown, unknown>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Demux.AnyRawInput<any, any, any>,
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        O2 extends readonly [Demux.AnyRawInput<any, any, any>, Sink.Sink<unknown, string, never, unknown, unknown>],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        O3 extends readonly [Demux.AnyRawInput<any, any, any>, Sink.Sink<unknown, string, never, unknown, unknown>],
        E1 = O1 extends [Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer E, infer _R>, RawStreamSocket]
            ? E
            : O1 extends [
                    Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer E, infer _R>,
                    RawStreamChannel<infer E, infer _OE, infer _R>,
                ]
              ? E
              : never,
        E2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, never, infer E, infer _R>]
            ? E
            : O2 extends [
                    RawStreamChannel<infer E, infer _OE, infer _R>,
                    Sink.Sink<infer _A, string, never, infer E, infer _R>,
                ]
              ? E
              : never,
        E3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, never, infer E, infer _R>]
            ? E
            : O3 extends [
                    RawStreamChannel<infer E, infer _OE, infer _R>,
                    Sink.Sink<infer _A, string, never, infer E, infer _R>,
                ]
              ? E
              : never,
        OE1 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer _R>,
            RawStreamChannel<infer _E, infer OE, infer _R>,
        ]
            ? OE
            : Socket.SocketError,
        OE2 = O2 extends [
            RawStreamSocket | RawStreamChannel<infer _E, infer OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer _R>,
        ]
            ? OE
            : Socket.SocketError,
        OE3 = O3 extends [
            RawStreamSocket | RawStreamChannel<infer _E, infer OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer _R>,
        ]
            ? OE
            : Socket.SocketError,
        R1 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer R>,
            RawStreamSocket | RawStreamChannel<infer _E, infer _OE, infer _R>,
        ]
            ? R
            : never,
        R2 = O2 extends [
            RawStreamSocket | RawStreamChannel<infer _E, infer _OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        R3 = O3 extends [
            RawStreamSocket | RawStreamChannel<infer _E, infer _OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        R4 = O1 extends [
            Stream.Stream<string | Uint8Array | Socket.CloseEvent, infer _E, infer _R>,
            RawStreamChannel<infer _E, infer _OE, infer R>,
        ]
            ? R
            : never,
        R5 = O2 extends [
            RawStreamSocket | RawStreamChannel<infer _E, infer _OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        R6 = O3 extends [
            RawStreamSocket | RawStreamChannel<infer _E, infer _OE, infer _R>,
            Sink.Sink<infer _A, string, never, infer _E, infer R>,
        ]
            ? R
            : never,
        A1 = O2 extends [
            RawStreamSocket | RawStreamChannel<infer _E, Socket.SocketError>,
            Sink.Sink<infer A, string, never, infer _E, infer _R>,
        ]
            ? A
            : void,
        A2 = O3 extends [
            RawStreamSocket | RawStreamChannel<infer _E, Socket.SocketError>,
            Sink.Sink<infer A, string, never, infer _E, infer _R>,
        ]
            ? A
            : void,
    >(
        sockets:
            | { stdin: O1; stdout?: never; stderr?: never }
            | { stdin?: never; stdout: O2; stderr?: never }
            | { stdin?: never; stdout?: never; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr?: never }
            | { stdin: O1; stdout?: never; stderr: O3 }
            | { stdin?: never; stdout: O2; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr: O3 }
            | Demux.HeterogeneousStdioRawInput<E1, E2, E3, OE1, OE2, OE3, R4, R5, R6>,
        sourceOrIoOrOptions?:
            | Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>
            | {
                  stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
                  stdout: Sink.Sink<A1, string, never, E2, R2>;
                  stderr: Sink.Sink<A2, string, never, E3, R3>;
              }
            | { encoding?: string | undefined }
            | undefined,
        sinkOrOptions?: Sink.Sink<A1, string, never, E2, R2> | { encoding?: string | undefined } | undefined,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    > => {
        type S1 = Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
        type S2 = Sink.Sink<A1, string, never, E2, R2>;
        type S3 = Sink.Sink<A2, string, never, E3, R3>;
        type CombinedInput = {
            stdin?: readonly [S1, RawStreamSocket | RawStreamChannel<E1, OE1, R4>];
            stdout?: readonly [RawStreamSocket | RawStreamChannel<E2, OE2, R5>, S2];
            stderr?: readonly [RawStreamSocket | RawStreamChannel<E3, OE3, R6>, S3];
        };

        const willMerge = (sourceOrIoOrOptions as S1 | undefined)?.[Stream.StreamTypeId] !== undefined;
        const isIoObject =
            Predicate.isNotUndefined(sourceOrIoOrOptions) &&
            "stdin" in sourceOrIoOrOptions &&
            sourceOrIoOrOptions["stdin"]?.[Stream.StreamTypeId] !== undefined;

        // Single sink case
        if (willMerge) {
            const sinkForBoth = sinkOrOptions as S2;
            const sourceStream = sourceOrIoOrOptions as S1;
            const { stderr, stdin, stdout } = sockets as Demux.HeterogeneousStdioRawInput<
                E1,
                E2,
                E3,
                OE1,
                OE2,
                OE3,
                R4,
                R5,
                R6
            >;

            const stdinChannel = isRawStreamChannel<E1, OE1, R4>(stdin)
                ? (stdin as RawStreamChannel<E1, OE1, R4>)
                : isRawStreamSocket(stdin)
                  ? (asRawStreamChannel<E1>(stdin) as unknown as RawStreamChannel<E1, OE1, R4>)
                  : undefined;

            const stdoutChannel = isRawStreamChannel<E2, OE2, R5>(stdout)
                ? (stdout as RawStreamChannel<E2, OE2, R5>)
                : isRawStreamSocket(stdout)
                  ? (asRawStreamChannel<E2>(stdout) as unknown as RawStreamChannel<E2, OE2, R5>)
                  : undefined;

            const stderrChannel = isRawStreamChannel<E3, OE3, R6>(stderr)
                ? (stderr as RawStreamChannel<E3, OE3, R6>)
                : isRawStreamSocket(stderr)
                  ? (asRawStreamChannel<E3>(stderr) as unknown as RawStreamChannel<E3, OE3, R6>)
                  : undefined;

            const runMerged = Stream.merge(
                Predicate.isNotUndefined(stdoutChannel) ? toStream(stdoutChannel) : Stream.empty,
                Predicate.isNotUndefined(stderrChannel) ? toStream(stderrChannel) : Stream.empty
            )
                .pipe(Stream.decodeText(options?.encoding))
                .pipe(Stream.run(sinkForBoth));

            const runStdin = Predicate.isNotUndefined(stdinChannel)
                ? demuxRawSocket(stdinChannel, sourceStream, Sink.drain, options)
                : Effect.void;

            return Effect.map(
                Effect.all({ ranStdin: runStdin, ranMerged: runMerged }, { concurrency: 2 }),
                ({ ranMerged }) => ranMerged
            );
        }

        // Multiple sinks case, combined input
        if (!isIoObject) {
            const { stderr, stdin, stdout } = sockets as CombinedInput;
            return demuxRawSockets(
                { stdin: stdin?.[1], stdout: stdout?.[0], stderr: stderr?.[0] } as Demux.HeterogeneousStdioRawInput<
                    E1,
                    E2,
                    E3,
                    OE1,
                    OE2,
                    OE3,
                    R4,
                    R5,
                    R6
                >,
                {
                    stdin: (stdin?.[0] ?? Stream.empty) as S1,
                    stdout: (stdout?.[1] ?? Sink.drain) as S2,
                    stderr: (stderr?.[1] ?? Sink.drain) as S3,
                },
                options
            );
        }

        // Multiple sinks case, regular input
        const { stderr, stdin, stdout } = sockets as Demux.HeterogeneousStdioRawInput<
            E1,
            E2,
            E3,
            OE1,
            OE2,
            OE3,
            R4,
            R5,
            R6
        >;
        const io = sourceOrIoOrOptions as { stdin: S1; stdout: S2; stderr: S3 };

        const runStdin = Predicate.isNotUndefined(stdin)
            ? demuxRawSocket(stdin, io.stdin, Sink.drain, options)
            : Stream.run(io.stdin, Sink.drain);

        const runStdout = Predicate.isNotUndefined(stdout)
            ? demuxRawSocket(stdout, Stream.never, io.stdout, options)
            : Stream.run(Stream.empty, io.stdout);

        const runStderr = Predicate.isNotUndefined(stderr)
            ? demuxRawSocket(stderr, Stream.never, io.stderr, options)
            : Stream.run(Stream.empty, io.stderr);

        return Effect.map(
            Effect.all({ ranStdin: runStdin, ranStdout: runStdout, ranStderr: runStderr }, { concurrency: 3 }),
            ({ ranStderr, ranStdout }) => compressDemuxOutput(Tuple.make(ranStdout, ranStderr))
        );
    }
);
