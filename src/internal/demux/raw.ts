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

/**
 * @since 1.0.0
 * @category Types
 */
export const RawContentType = "application/vnd.docker.raw-stream" as const;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const RawSocketTypeId: unique symbol = Symbol.for("the-moby-effect/demux/RawSocket") as RawSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type RawSocketTypeId = typeof RawSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const RawChannelTypeId: unique symbol = Symbol.for("the-moby-effect/demux/RawChannel") as RawChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type RawChannelTypeId = typeof RawChannelTypeId;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * Note for Leo: This exists because the input error type "IE" might not be
 * known at the time of converting the Socket to a Channel.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type RawSocket = {
    readonly "content-type": typeof RawContentType;
    readonly [RawSocketTypeId]: typeof RawSocketTypeId;
    readonly underlying: Socket.Socket;
};

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * Note for Leo: This exists because there is no way to convert from a Channel
 * to a Socket. In fact, with my current effect knowledge, I believe it is
 * impossible to implement. This is still needed though for the pack and fan
 * implementations which seek to return these types.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export type RawChannel<IE = unknown, OE = Socket.SocketError, R = never> = {
    readonly "content-type": typeof RawContentType;
    readonly [RawChannelTypeId]: typeof RawChannelTypeId;
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
export type EitherRawInput<IE, OE, R> = RawSocket | RawChannel<IE, OE, R>;

/**
 * @since 1.0.0
 * @category Types
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyRawInput = EitherRawInput<any, any, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * @since 1.0.0
 * @category Types
 */
export type HomogeneousStdioRawSocketInput =
    | { stdin: RawSocket; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: RawSocket; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: RawSocket }
    | { stdin: RawSocket; stdout: RawSocket; stderr?: never }
    | { stdin: RawSocket; stdout?: never; stderr: RawSocket }
    | { stdin?: never; stdout: RawSocket; stderr: RawSocket }
    | { stdin: RawSocket; stdout: RawSocket; stderr: RawSocket };

/**
 * @since 1.0.0
 * @category Types
 */
export type HomogeneousStdioRawChannelInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3> =
    | { stdin: RawChannel<IE1, OE1, R1>; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: RawChannel<IE2, OE2, R2>; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: RawChannel<IE3, OE3, R3> }
    | { stdin: RawChannel<IE1, OE1, R1>; stdout: RawChannel<IE2, OE2, R2>; stderr?: never }
    | { stdin: RawChannel<IE1, OE1, R1>; stdout?: never; stderr: RawChannel<IE3, OE3, R3> }
    | { stdin?: never; stdout: RawChannel<IE2, OE2, R2>; stderr: RawChannel<IE3, OE3, R3> }
    | { stdin: RawChannel<IE1, OE1, R1>; stdout: RawChannel<IE2, OE2, R2>; stderr: RawChannel<IE3, OE3, R3> };

/**
 * @since 1.0.0
 * @category Types
 */
export type HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3> =
    | { stdin: EitherRawInput<IE1, OE1, R1>; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: EitherRawInput<IE2, OE2, R2>; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: EitherRawInput<IE3, OE3, R3> }
    | { stdin: EitherRawInput<IE1, OE1, R1>; stdout: EitherRawInput<IE2, OE2, R2>; stderr?: never }
    | { stdin: EitherRawInput<IE1, OE1, R1>; stdout?: never; stderr: EitherRawInput<IE3, OE3, R3> }
    | { stdin?: never; stdout: EitherRawInput<IE2, OE2, R2>; stderr: EitherRawInput<IE3, OE3, R3> }
    | {
          stdin: EitherRawInput<IE1, OE1, R1>;
          stdout: EitherRawInput<IE2, OE2, R2>;
          stderr: EitherRawInput<IE3, OE3, R3>;
      };

/**
 * @since 1.0.0
 * @category Types
 */
export type HeterogeneousStdioTupledRawInput<
    A1,
    A2,
    L1,
    L2,
    E1,
    E2,
    E3,
    R1,
    R2,
    R3,
    IE1,
    IE2,
    IE3,
    OE1,
    OE2,
    OE3,
    R4,
    R5,
    R6,
> =
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout?: never;
          stderr?: never;
      }
    | {
          stdin?: never;
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr?: never;
      }
    | {
          stdin?: never;
          stdout?: never;
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      }
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr?: never;
      }
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout?: never;
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      }
    | {
          stdin?: never;
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      }
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      };

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeRawSocket = (underlying: Socket.Socket): RawSocket => ({
    underlying,
    "content-type": RawContentType,
    [RawSocketTypeId]: RawSocketTypeId,
});

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeRawChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        IE | OE,
        IE,
        void,
        unknown,
        R
    >
): RawChannel<IE, OE, R> => ({
    underlying,
    "content-type": RawContentType,
    [RawChannelTypeId]: RawChannelTypeId,
});

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawSocket = (u: unknown): u is RawSocket => Predicate.hasProperty(u, RawSocketTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
): u is RawChannel<IE, OE, R> => Predicate.hasProperty(u, RawChannelTypeId);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsRawResponse = (response: HttpClientResponse.HttpClientResponse): boolean =>
    response.headers["content-type"] === RawContentType;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const asRawChannel = <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherRawInput<IE, OE, R>
): RawChannel<IE, OE, R> =>
    isRawSocket(input)
        ? (makeRawChannel(Socket.toChannel<IE>(input.underlying)) as unknown as RawChannel<IE, OE, R>)
        : (input as RawChannel<IE, OE, R>);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawToStream = <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherRawInput<IE, OE, R>
): Stream.Stream<Uint8Array, IE | OE, R> =>
    Channel.toStream(
        asRawChannel(input).underlying as Channel.Channel<
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
export const rawToSink = <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherRawInput<IE, OE, R>
): Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> =>
    Channel.toSink(asRawChannel(input).underlying);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawFromStreamWith =
    <IE>() =>
    <E, R>(input: Stream.Stream<Uint8Array, IE | E, R>): RawChannel<IE, E, R> =>
        makeRawChannel<IE, E, R>(Stream.toChannel(input));

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawFromStream = <E, R>(input: Stream.Stream<Uint8Array, E, R>): RawChannel<unknown, E, R> =>
    rawFromStreamWith<unknown>()(input);

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawFromSink = <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
): RawChannel<never, E, R> => makeRawChannel<never, E, R>(Sink.toChannel(input));

/**
 * Interleaves an stdout socket with an stderr socket.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveToStream = <
    IE1 = never,
    IE2 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: EitherRawInput<IE1, OE1, R1>,
    stderr: EitherRawInput<IE2, OE2, R2>
): Stream.Stream<Uint8Array, IE1 | IE2 | OE1 | OE2, R1 | R2> => {
    return Stream.interleave(rawToStream(stdout), rawToStream(stderr));
};

/**
 * Merge an stdout socket with an stderr socket and tags the output stream.
 *
 * @since 1.0.0
 * @category Merging
 */
export const mergeToTaggedStream = <
    IE1 = never,
    IE2 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: EitherRawInput<IE1, OE1, R1>,
    stderr: EitherRawInput<IE2, OE2, R2>,
    options?: { bufferSize?: number | undefined } | undefined
): Stream.Stream<
    { _tag: "stdout"; value: Uint8Array } | { _tag: "stderr"; value: Uint8Array },
    IE1 | IE2 | OE1 | OE2,
    R1 | R2
> =>
    Stream.mergeWithTag(
        {
            stdout: rawToStream(asRawChannel(stderr)),
            stderr: rawToStream(asRawChannel(stdout)),
        } as const,
        {
            concurrency: "unbounded",
            bufferSize: options?.bufferSize,
        } as const
    );

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxRawToSingleSink = Function.dual<
    // Data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R3 = never>(
        socket: EitherRawInput<E1 | IE, OE, R3>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // Data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socket: EitherRawInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    (arguments_) => isRawSocket(arguments_[0]) || isRawChannel(arguments_[0]),
    (socket, source, sink, options) =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(asRawChannel(socket).underlying),
            Stream.decodeText(options?.encoding),
            Stream.run(sink)
        )
);

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSingleSink}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSingleSink}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxStdioRawTupled: <
    A1 = void,
    A2 = void,
    L1 = never,
    L2 = never,
    E1 = never,
    E2 = never,
    E3 = never,
    R1 = never,
    R2 = never,
    R3 = never,
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
    sockets: HeterogeneousStdioTupledRawInput<
        A1,
        A2,
        L1,
        L2,
        E1,
        E2,
        E3,
        R1,
        R2,
        R3,
        IE1,
        IE2,
        IE3,
        OE1,
        OE2,
        OE3,
        R4,
        R5,
        R6
    >,
    options?: { encoding?: string | undefined } | undefined
) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
    | Exclude<R1, Scope.Scope>
    | Exclude<R2, Scope.Scope>
    | Exclude<R3, Scope.Scope>
    | Exclude<R4, Scope.Scope>
    | Exclude<R5, Scope.Scope>
    | Exclude<R6, Scope.Scope>
> = Effect.fnUntraced(function* (sockets, options) {
    const { stderr, stdin, stdout } = sockets;

    const stdinSocketObject = Predicate.isNotUndefined(stdin) ? { stdin: stdin?.[1] } : {};
    const stdoutSocketObject = Predicate.isNotUndefined(stdout) ? { stdout: stdout?.[0] } : {};
    const stderrSocketObject = Predicate.isNotUndefined(stderr) ? { stderr: stderr?.[0] } : {};

    const stdinIoObject = Predicate.isNotUndefined(stdin)
        ? { stdin: stdin?.[0] }
        : { stdin: Stream.empty as Stream.Stream<never, never, never> };

    const stdoutIoObject = Predicate.isNotUndefined(stdout)
        ? { stdout: stdout?.[1] }
        : { stdout: Sink.succeed<void>(void 0) as unknown as Sink.Sink<never, string, never, never, never> };

    const stderrIoObject = Predicate.isNotUndefined(stderr)
        ? { stderr: stderr?.[1] }
        : { stderr: Sink.succeed<void>(void 0) as unknown as Sink.Sink<never, string, never, never, never> };

    return yield* demuxStdioRawToSeparateSinks(
        { ...stdinSocketObject, ...stdoutSocketObject, ...stderrSocketObject },
        { ...stdinIoObject, ...stdoutIoObject, ...stderrIoObject },
        options
    );
});

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSingleSink}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSingleSink}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxStdioRawToSingleSink = Function.dual<
    // Single sink, data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <
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
        sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R3, R4, R5>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
    >,
    // Single sink, data-first signature.
    <
        A1,
        L1,
        E1,
        E2,
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
        sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R3, R4, R5>,
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
    >
>(
    (arguments_) => "stdin" in arguments_[0] || "stdout" in arguments_[0] || "stderr" in arguments_[0],
    Effect.fnUntraced(function* (sockets, source, sink, options) {
        const { stderr, stdin, stdout } = sockets;

        const stdoutStream = Predicate.isUndefined(stdout) ? Stream.empty : rawToStream(stdout);
        const stderrStream = Predicate.isUndefined(stderr) ? Stream.empty : rawToStream(stderr);

        const runInput = Predicate.isNotUndefined(stdin)
            ? demuxRawToSingleSink(stdin, source, Sink.drain, options)
            : Stream.run(source, Sink.drain);

        const runOutput = Stream.interleave(stdoutStream, stderrStream)
            .pipe(Stream.decodeText(options?.encoding))
            .pipe(Stream.run(sink));

        return yield* Effect.map(
            Effect.all({ ranStdin: runInput, ranOutput: runOutput }, { concurrency: 2 }),
            ({ ranOutput }) => ranOutput
        );
    })
);

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSingleSink}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSingleSink}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxStdioRawToSeparateSinks = Function.dual<
    // Multiple sinks, data-last signature.
    <A1, A2, L1, L2, E1, E2, E3, R1, R2, R3>(
        io: {
            stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
            stdout: Sink.Sink<A1, string, L1, E2, R2>;
            stderr: Sink.Sink<A2, string, L2, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ) => <
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
        sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R4, R5, R6>
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    >,
    // Multiple sinks, data-first signature.
    <
        A1,
        A2,
        L1,
        L2,
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
        sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R4, R5, R6>,
        io: {
            stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
            stdout: Sink.Sink<A1, string, L1, E2, R2>;
            stderr: Sink.Sink<A2, string, L2, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
        | Exclude<R1, Scope.Scope>
        | Exclude<R2, Scope.Scope>
        | Exclude<R3, Scope.Scope>
        | Exclude<R4, Scope.Scope>
        | Exclude<R5, Scope.Scope>
        | Exclude<R6, Scope.Scope>
    >
>(
    (arguments_) => !("stdin" in arguments_[0] && Predicate.hasProperty(arguments_[0]["stdin"], Stream.StreamTypeId)),
    Effect.fnUntraced(function* (sockets, io, options) {
        const { stderr, stdin, stdout } = sockets;

        const runStdin = Predicate.isNotUndefined(stdin)
            ? demuxRawToSingleSink(stdin, io.stdin, Sink.drain, options)
            : Stream.run(io.stdin, Sink.succeed<void>(void 0));

        const runStdout = Predicate.isNotUndefined(stdout)
            ? demuxRawToSingleSink(stdout, Stream.never, io.stdout, options)
            : Stream.run(Stream.empty, io.stdout);

        const runStderr = Predicate.isNotUndefined(stderr)
            ? demuxRawToSingleSink(stderr, Stream.never, io.stderr, options)
            : Stream.run(Stream.empty, io.stderr);

        return yield* Effect.map(
            Effect.all({ ranStdin: runStdin, ranStdout: runStdout, ranStderr: runStderr }, { concurrency: 3 }),
            ({ ranStderr, ranStdout }) => compressDemuxOutput(Tuple.make(ranStdout, ranStderr))
        );
    })
);
