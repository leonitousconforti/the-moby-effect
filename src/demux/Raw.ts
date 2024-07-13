/**
 * Demux utilities for raw streams.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Brand from "effect/Brand";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

/**
 * @since 1.0.0
 * @category Types
 */
export const RawStreamSocketContentType = "application/vnd.docker.raw-stream" as const;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Types
 */
export type RawStreamSocket = Socket.Socket & {
    "content-type": typeof RawStreamSocketContentType;
} & Brand.Brand<"RawStreamSocket">;

/**
 * @since 1.0.0
 * @category Brands
 */
export const RawStreamSocket = Brand.refined<RawStreamSocket>(
    (socket) => socket["content-type"] === RawStreamSocketContentType,
    (socket) =>
        Brand.error(
            `Expected a raw stream socket with content type "${RawStreamSocketContentType}", but this socket has content type ${socket["content-type"]}`
        )
);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
    response.headers["content-type"] === RawStreamSocketContentType;

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
export const demuxRawSocket = Function.dual<
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ) => (
        socket: RawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>,
    <A1, E1, E2, R1, R2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
>(
    3,
    <A1, E1, E2, R1, R2>(
        socket: RawStreamSocket,
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
export const demuxRawSockets = <
    S1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, RawStreamSocket],
    S2 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
    S3 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
    A1 = S2 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : undefined,
    A2 = S3 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : undefined,
    E1 = S1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, RawStreamSocket] ? E : never,
    E2 = S2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
    E3 = S3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
    R1 = S1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, RawStreamSocket] ? R : never,
    R2 = S2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
    R3 = S3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
    A = A1 extends undefined | void
        ? A2 extends undefined | void
            ? void
            : readonly [stdout: undefined, stderr: A2]
        : A2 extends undefined | void
          ? readonly [stdout: A1, stderr: undefined]
          : readonly [stdout: A1, stderr: A2],
>(
    streams:
        | { stdin: S1; stdout?: never; stderr?: never }
        | { stdin?: never; stdout: S2; stderr?: never }
        | { stdin?: never; stdout?: never; stderr: S3 }
        | { stdin: S1; stdout: S2; stderr?: never }
        | { stdin: S1; stdout?: never; stderr: S3 }
        | { stdin?: never; stdout: S2; stderr: S3 }
        | { stdin: S1; stdout: S2; stderr: S3 }
): Effect.Effect<
    A,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
> => {
    type S4 = Stream.Stream<string | Uint8Array, E1, R1>;
    type S5 = Sink.Sink<A1, string, string, E2, R2>;
    type S6 = Sink.Sink<A2, string, string, E3, R3>;
    type StdinEffect = Effect.Effect<void, E1 | Socket.SocketError, Exclude<R1, Scope.Scope>>;
    type StdoutEffect = Effect.Effect<A1, E2 | Socket.SocketError, Exclude<R2, Scope.Scope>>;
    type StderrEffect = Effect.Effect<A2, E3 | Socket.SocketError, Exclude<R3, Scope.Scope>>;

    const { stderr, stdin, stdout } = streams;

    const runStdin: StdinEffect = Predicate.isNotUndefined(stdin)
        ? demuxRawSocket(stdin[1], stdin[0] as S4, Sink.drain)
        : Effect.void;

    const runStdout: StdoutEffect = Predicate.isNotUndefined(stdout)
        ? demuxRawSocket(stdout[0], Stream.never, stdout[1] as S5)
        : Function.unsafeCoerce(Effect.sync(Function.constUndefined));

    const runStderr: StderrEffect = stderr
        ? demuxRawSocket(stderr[0], Stream.never, stderr[1] as S6)
        : Function.unsafeCoerce(Effect.sync(Function.constUndefined));

    return Effect.map(
        Effect.all(
            {
                ranStdin: runStdin,
                ranStdout: runStdout,
                ranStderr: runStderr,
            },
            { concurrency: 3 }
        ),
        ({ ranStderr, ranStdout }) => {
            if (Predicate.isUndefined(ranStderr) && Predicate.isUndefined(ranStdout)) {
                return void 0 as A;
            } else {
                return Tuple.make(ranStdout, ranStderr) as A;
            }
        }
    );
};
