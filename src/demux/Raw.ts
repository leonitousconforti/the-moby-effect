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
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { CompressedDemuxOutput, compressDemuxOutput } from "./Compressed.js";
import type { Demux } from "./Demux.js";

/**
 * @since 1.0.0
 * @category Types
 * @internal
 */
export const RawStreamSocketContentType = "application/vnd.docker.raw-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 * @internal
 */
export const RawStreamSocketTypeId: unique symbol = Symbol.for("the-moby-effect/demux/RawStreamSocket");

/**
 * @since 1.0.0
 * @category Type ids
 * @internal
 */
export type RawStreamSocketTypeId = typeof RawStreamSocketTypeId;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type RawStreamSocket = Socket.Socket & {
    readonly "content-type": typeof RawStreamSocketContentType;
    readonly [RawStreamSocketTypeId]: typeof RawStreamSocketTypeId;
};

/**
 * @since 1.0.0
 * @category Constructors
 * @internal
 */
export const makeRawStreamSocket = (socket: Socket.Socket): RawStreamSocket => ({
    ...socket,
    "content-type": RawStreamSocketContentType,
    [RawStreamSocketTypeId]: RawStreamSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawStreamSocket = (u: unknown): u is RawStreamSocket => Predicate.hasProperty(u, RawStreamSocketTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 * @internal
 */
export const responseIsRawStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
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
 */
export const demuxRawSocket = Function.dual<
    // Data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => (
        socket: RawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>,
    // Data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
>(
    (arguments_) => isRawStreamSocket(arguments_[0]),
    <A1, E1, E2, R1, R2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.decodeText(options?.encoding),
            Stream.run(sink)
        )
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
        O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, RawStreamSocket],
        O2 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        O3 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, RawStreamSocket] ? E : never,
        E2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        E3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, RawStreamSocket] ? R : never,
        R2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        R3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        A1 = O2 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
        A2 = O3 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
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
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;

    // Multiple sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        sockets: Demux.StdinStdoutStderrSocketOptions,
        io: {
            stdin: Stream.Stream<string | Uint8Array, E1, R1>;
            stdout: Sink.Sink<A1, string, string, E2, R2>;
            stderr: Sink.Sink<A2, string, string, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Multiple sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        io: {
            stdin: Stream.Stream<string | Uint8Array, E1, R1>;
            stdout: Sink.Sink<A1, string, string, E2, R2>;
            stderr: Sink.Sink<A2, string, string, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ): (
        sockets: Demux.StdinStdoutStderrSocketOptions
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;

    // Single sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        sockets: Demux.StdinStdoutStderrSocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    // Single sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        sockets: Demux.StdinStdoutStderrSocketOptions
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
} = Function.dual(
    (arguments_) =>
        !(
            arguments_[0][Stream.StreamTypeId] !== undefined ||
            ("stdin" in arguments_[0] && arguments_[0]["stdin"]?.[Stream.StreamTypeId] !== undefined)
        ),
    <
        O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, RawStreamSocket],
        O2 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        O3 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, RawStreamSocket] ? E : never,
        E2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        E3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, RawStreamSocket] ? R : never,
        R2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        R3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        A1 = O2 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
        A2 = O3 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
    >(
        sockets:
            | { stdin: O1; stdout?: never; stderr?: never }
            | { stdin?: never; stdout: O2; stderr?: never }
            | { stdin?: never; stdout?: never; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr?: never }
            | { stdin: O1; stdout?: never; stderr: O3 }
            | { stdin?: never; stdout: O2; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr: O3 }
            | Demux.StdinStdoutStderrSocketOptions,
        sourceOrIoOrOptions?:
            | Stream.Stream<string | Uint8Array, E1, R1>
            | {
                  stdin: Stream.Stream<string | Uint8Array, E1, R1>;
                  stdout: Sink.Sink<A1, string, string, E2, R2>;
                  stderr: Sink.Sink<A2, string, string, E3, R3>;
              }
            | { encoding?: string | undefined }
            | undefined,
        sinkOrOptions?: Sink.Sink<A1, string, string, E2, R2> | { encoding?: string | undefined } | undefined,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        type S1 = Stream.Stream<string | Uint8Array, E1, R1>;
        type S2 = Sink.Sink<A1, string, string, E2, R2>;
        type S3 = Sink.Sink<A2, string, string, E3, R3>;
        type CombinedInput = {
            stdin?: readonly [S1, RawStreamSocket];
            stdout?: readonly [RawStreamSocket, S2];
            stderr?: readonly [RawStreamSocket, S3];
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
            const { stderr, stdin, stdout } = sockets as Demux.StdinStdoutStderrSocketOptions;

            const transformToStream = (socket: RawStreamSocket): Stream.Stream<string, Socket.SocketError, never> =>
                Function.pipe(
                    Stream.empty,
                    Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
                    Stream.decodeText(options?.encoding)
                );

            const mergedStream = Stream.merge(
                Predicate.isNotUndefined(stdout) ? transformToStream(stdout) : Stream.empty,
                Predicate.isNotUndefined(stderr) ? transformToStream(stderr) : Stream.empty
            );

            const runMerged = Stream.run(mergedStream, sinkForBoth);
            const runStdin = Predicate.isNotUndefined(stdin)
                ? demuxRawSocket(
                      stdin,
                      Stream.concat(sourceStream, Stream.make(new Socket.CloseEvent())),
                      Sink.drain,
                      options
                  )
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
                { stdin: stdin?.[1], stdout: stdout?.[0], stderr: stderr?.[0] } as Demux.StdinStdoutStderrSocketOptions,
                {
                    stdin: (stdin?.[0] ?? Stream.empty) as S1,
                    stdout: (stdout?.[1] ?? Sink.drain) as S2,
                    stderr: (stderr?.[1] ?? Sink.drain) as S3,
                },
                options
            );
        }

        // Multiple sinks case, regular input
        const { stderr, stdin, stdout } = sockets as Demux.StdinStdoutStderrSocketOptions;
        const io = sourceOrIoOrOptions as { stdin: S1; stdout: S2; stderr: S3 };

        const runStdin = Predicate.isNotUndefined(stdin)
            ? demuxRawSocket(stdin, Stream.concat(io.stdin, Stream.make(new Socket.CloseEvent())), Sink.drain, options)
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
