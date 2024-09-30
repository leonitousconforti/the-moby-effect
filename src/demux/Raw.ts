/**
 * Demux utilities for raw streams.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
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
export const RawStreamSocketContentType = "application/vnd.docker.raw-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const BidirectionalRawStreamSocketTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/BidirectionalRawStreamSocket"
);

/**
 * @since 1.0.0
 * @category Type ids
 */
export type BidirectionalRawStreamSocketTypeId = typeof BidirectionalRawStreamSocketTypeId;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type BidirectionalRawStreamSocket = Socket.Socket & {
    readonly "content-type": typeof RawStreamSocketContentType;
    readonly [BidirectionalRawStreamSocketTypeId]: typeof BidirectionalRawStreamSocketTypeId;
};

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isBidirectionalRawStreamSocket = (u: unknown): u is BidirectionalRawStreamSocket =>
    Predicate.hasProperty(u, BidirectionalRawStreamSocketTypeId);

/**
 * @since 1.0.0
 * @category Type ids
 */
export const UnidirectionalRawStreamSocketTypeId: unique symbol = Symbol.for(
    "the-moby-effect/demux/UnidirectionalRawStreamSocketTypeId"
);

/**
 * @since 1.0.0
 * @category Type ids
 */
export type UnidirectionalRawStreamSocketTypeId = typeof UnidirectionalRawStreamSocketTypeId;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Types
 */
export type UnidirectionalRawStreamSocket = Socket.Socket & {
    readonly "content-type": typeof RawStreamSocketContentType;
    readonly [UnidirectionalRawStreamSocketTypeId]: typeof UnidirectionalRawStreamSocketTypeId;
};

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isUnidirectionalRawStreamSocket = (u: unknown): u is UnidirectionalRawStreamSocket =>
    Predicate.hasProperty(u, UnidirectionalRawStreamSocketTypeId);

/**
 * @since 1.0.0
 * @category Casting
 */
export const downcastBidirectionalToUnidirectional = ({
    [BidirectionalRawStreamSocketTypeId]: _,
    ...rest
}: BidirectionalRawStreamSocket): UnidirectionalRawStreamSocket => ({
    ...rest,
    [UnidirectionalRawStreamSocketTypeId]: UnidirectionalRawStreamSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Casting
 */
export const upcastUnidirectionalToBidirectional = ({
    [UnidirectionalRawStreamSocketTypeId]: _,
    ...rest
}: UnidirectionalRawStreamSocket): BidirectionalRawStreamSocket => ({
    ...rest,
    [BidirectionalRawStreamSocketTypeId]: BidirectionalRawStreamSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsRawStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
    response.headers["content-type"] === RawStreamSocketContentType;

/**
 * Transforms an http response into a raw stream socket. If the response is not
 * a raw stream socket, then an error will be returned.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToRawStreamSocketOrFail = Function.dual<
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ) => (
        response: HttpClientResponse.HttpClientResponse
    ) => Effect.Effect<
        SourceIsKnownUnidirectional extends true
            ? UnidirectionalRawStreamSocket
            : SourceIsKnownBidirectional extends true
              ? BidirectionalRawStreamSocket
              : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket,
        Socket.SocketError,
        never
    >,
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        response: HttpClientResponse.HttpClientResponse,
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ) => Effect.Effect<
        SourceIsKnownUnidirectional extends true
            ? UnidirectionalRawStreamSocket
            : SourceIsKnownBidirectional extends true
              ? BidirectionalRawStreamSocket
              : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket,
        Socket.SocketError,
        never
    >
>(
    (_arguments) => _arguments[0][HttpClientResponse.TypeId] !== undefined,
    <
        SourceIsKnownUnidirectional extends true | undefined = undefined,
        SourceIsKnownBidirectional extends true | undefined = undefined,
    >(
        response: HttpClientResponse.HttpClientResponse,
        options?:
            | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
            | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
            | undefined
    ): Effect.Effect<
        SourceIsKnownUnidirectional extends true
            ? UnidirectionalRawStreamSocket
            : SourceIsKnownBidirectional extends true
              ? BidirectionalRawStreamSocket
              : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket,
        Socket.SocketError,
        never
    > =>
        Effect.gen(function* () {
            type Ret = SourceIsKnownUnidirectional extends true
                ? UnidirectionalRawStreamSocket
                : SourceIsKnownBidirectional extends true
                  ? BidirectionalRawStreamSocket
                  : UnidirectionalRawStreamSocket | BidirectionalRawStreamSocket;

            if (!responseIsRawStreamSocketResponse(response)) {
                return yield* new Socket.SocketGenericError({
                    reason: "Read",
                    cause: `Response with content type "${response.headers["content-type"]}" is not a raw streaming socket`,
                });
            }

            const NodeSocketLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeSocket"));
            const socket = (response as IExposeSocketOnEffectClientResponseHack).source.socket;
            const effectSocket: Socket.Socket = yield* NodeSocketLazy.fromDuplex(Effect.sync(() => socket));

            const bidirectional: BidirectionalRawStreamSocket = {
                ...effectSocket,
                "content-type": RawStreamSocketContentType,
                [BidirectionalRawStreamSocketTypeId]: BidirectionalRawStreamSocketTypeId,
            };

            const sourceIsKnownUnidirectional =
                Predicate.isNotUndefined(options) &&
                Predicate.hasProperty(options, "sourceIsKnownUnidirectional") &&
                options.sourceIsKnownUnidirectional === true;

            return sourceIsKnownUnidirectional
                ? (downcastBidirectionalToUnidirectional(bidirectional) as Ret)
                : (bidirectional as Ret);
        })
);

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * To demux multiple raw sockets, you should use {@link demuxRawSockets}
 *
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxBidirectionalRawSocket = Function.dual<
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ) => (
        socket: BidirectionalRawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>,
    <A1, E1, E2, R1, R2>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
>(
    3,
    <A1, E1, E2, R1, R2>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.decodeText("utf-8"),
            Stream.run(sink)
        )
);

/**
 * Demux multiple raw sockets, created from multiple container attach websocket
 * requests. If no options are provided for a given stream, it will be ignored.
 * This is really just an Effect.all wrapper around {@link demuxRawSocket}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSocket}
 *
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttachWebsocket
 */
export const demuxUnidirectionalRawSockets = <
    O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, UnidirectionalRawStreamSocket],
    O2 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
    O3 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
    E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, UnidirectionalRawStreamSocket] ? E : never,
    E2 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
    E3 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
    R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, UnidirectionalRawStreamSocket] ? R : never,
    R2 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
    R3 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
    A1 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>]
        ? A
        : undefined,
    A2 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>]
        ? A
        : undefined,
>(
    streams:
        | { stdin: O1; stdout?: never; stderr?: never }
        | { stdin?: never; stdout: O2; stderr?: never }
        | { stdin?: never; stdout?: never; stderr: O3 }
        | { stdin: O1; stdout: O2; stderr?: never }
        | { stdin: O1; stdout?: never; stderr: O3 }
        | { stdin?: never; stdout: O2; stderr: O3 }
        | { stdin: O1; stdout: O2; stderr: O3 }
): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
> => {
    type S1 = Stream.Stream<string | Uint8Array, E1, R1>;
    type S2 = Sink.Sink<A1, string, string, E2, R2>;
    type S3 = Sink.Sink<A2, string, string, E3, R3>;
    type StdinEffect = Effect.Effect<void, E1 | Socket.SocketError, Exclude<R1, Scope.Scope>>;
    type StdoutEffect = Effect.Effect<A1, E2 | Socket.SocketError, Exclude<R2, Scope.Scope>>;
    type StderrEffect = Effect.Effect<A2, E3 | Socket.SocketError, Exclude<R3, Scope.Scope>>;

    const { stderr, stdin, stdout } = streams;

    const runStdin: StdinEffect = Predicate.isNotUndefined(stdin)
        ? demuxBidirectionalRawSocket(upcastUnidirectionalToBidirectional(stdin[1]), stdin[0] as S1, Sink.drain)
        : Effect.void;

    const runStdout: StdoutEffect = Predicate.isNotUndefined(stdout)
        ? demuxBidirectionalRawSocket(upcastUnidirectionalToBidirectional(stdout[0]), Stream.never, stdout[1] as S2)
        : Function.unsafeCoerce(Effect.sync(Function.constUndefined));

    const runStderr: StderrEffect = stderr
        ? demuxBidirectionalRawSocket(upcastUnidirectionalToBidirectional(stderr[0]), Stream.never, stderr[1] as S3)
        : Function.unsafeCoerce(Effect.sync(Function.constUndefined));

    return Effect.map(
        Effect.all({ ranStdin: runStdin, ranStdout: runStdout, ranStderr: runStderr }, { concurrency: 3 }),
        ({ ranStderr, ranStdout }) => compressDemuxOutput(Tuple.make(ranStdout, ranStderr))
    );
};
