import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as Chunk from "effect/Chunk";
import type * as Scope from "effect/Scope";
import type * as MobyDemux from "../../MobyDemux.js";

import * as Socket from "@effect/platform/Socket";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Pipeable from "effect/Pipeable";
import * as Predicate from "effect/Predicate";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";
import * as internalCompressed from "./compressed.js";

/** @internal */
export const RawContentType = "application/vnd.docker.raw-stream" as const;

/** @internal */
export const RawSocketTypeId: MobyDemux.RawSocketTypeId = Symbol.for(
    "the-moby-effect/demux/RawSocket"
) as MobyDemux.RawSocketTypeId;

/** @internal */
export const RawChannelTypeId: MobyDemux.RawChannelTypeId = Symbol.for(
    "the-moby-effect/demux/RawChannel"
) as MobyDemux.RawChannelTypeId;

/** @internal */
export const makeRawSocket = (underlying: Socket.Socket): MobyDemux.RawSocket => ({
    underlying,
    "content-type": RawContentType,
    [RawSocketTypeId]: RawSocketTypeId,
    pipe() {
        return Pipeable.pipeArguments(this, arguments);
    },
});

/** @internal */
export const makeRawChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        OE,
        IE,
        void,
        unknown,
        R
    >
): MobyDemux.RawChannel<IE, IE | OE, R> => ({
    underlying,
    "content-type": RawContentType,
    [RawChannelTypeId]: RawChannelTypeId,
    pipe() {
        return Pipeable.pipeArguments(this, arguments);
    },
});

/** @internal */
export const isRawSocket = (u: unknown): u is MobyDemux.RawSocket => Predicate.hasProperty(u, RawSocketTypeId);

/** @internal */
export const isRawChannel = <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
): u is MobyDemux.RawChannel<IE, IE | OE, R> => Predicate.hasProperty(u, RawChannelTypeId);

/** @internal */
export const responseIsRawResponse = (response: HttpClientResponse.HttpClientResponse): boolean =>
    response.headers["content-type"] === RawContentType;

/** @internal */
export const asRawChannel = <IE = never, OE = Socket.SocketError, R = never>(
    input: MobyDemux.EitherRawInput<IE, OE, R>
): MobyDemux.RawChannel<IE, OE, R> =>
    isRawSocket(input)
        ? (makeRawChannel(Socket.toChannel<IE>(input.underlying)) as unknown as MobyDemux.RawChannel<IE, OE, R>)
        : (input as MobyDemux.RawChannel<IE, OE, R>);

/** @internal */
export const rawToStream = <IE = never, OE = Socket.SocketError, R = never>(
    input: MobyDemux.EitherRawInput<IE, OE, R>
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

/** @internal */
export const rawToSink = <IE = never, OE = Socket.SocketError, R = never>(
    input: MobyDemux.EitherRawInput<IE, OE, R>
): Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> =>
    Channel.toSink(asRawChannel(input).underlying);

/** @internal */
export const rawFromStreamWith =
    <IE>() =>
    <E, R>(input: Stream.Stream<Uint8Array, IE | E, R>): MobyDemux.RawChannel<IE, IE | E, R> =>
        makeRawChannel<IE, IE | E, R>(Stream.toChannel(input));

/** @internal */
export const rawFromStream = <E, R>(input: Stream.Stream<Uint8Array, E, R>): MobyDemux.RawChannel<never, E, R> =>
    rawFromStreamWith<never>()(input);

/** @internal */
export const rawFromSink = <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
): MobyDemux.RawChannel<never, E, R> => makeRawChannel<never, E, R>(Sink.toChannel(input));

/** @internal */
export const interleaveRaw = <
    IE1 = never,
    IE2 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: MobyDemux.EitherRawInput<IE1, OE1, R1>,
    stderr: MobyDemux.EitherRawInput<IE2, OE2, R2>
): Stream.Stream<Uint8Array, IE1 | IE2 | OE1 | OE2, R1 | R2> => {
    return Stream.interleave(rawToStream(stdout), rawToStream(stderr));
};

/** @internal */
export const mergeRawToTaggedStream = <
    IE1 = never,
    IE2 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: MobyDemux.EitherRawInput<IE1, OE1, R1>,
    stderr: MobyDemux.EitherRawInput<IE2, OE2, R2>,
    options?: { bufferSize?: number | undefined } | undefined
): Stream.Stream<
    { _tag: "stdout"; value: Uint8Array } | { _tag: "stderr"; value: Uint8Array },
    IE1 | IE2 | OE1 | OE2,
    R1 | R2
> =>
    Stream.mergeWithTag(
        {
            stdout: rawToStream(asRawChannel(stdout)),
            stderr: rawToStream(asRawChannel(stderr)),
        } as const,
        {
            concurrency: "unbounded",
            bufferSize: options?.bufferSize,
        } as const
    );

/** @internal */
export const demuxRawToSingleSink = Function.dual<
    // Data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R3 = never>(
        socket: MobyDemux.EitherRawInput<E1 | IE, OE, R3>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // Data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socket: MobyDemux.EitherRawInput<E1 | IE, OE, R3>,
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

/** @internal */
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
    sockets: MobyDemux.HeterogeneousStdioTupledRawInput<
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
    MobyDemux.CompressedDemuxOutput<A1, A2>,
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

/** @internal */
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
        sockets: MobyDemux.HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R3, R4, R5>
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
        sockets: MobyDemux.HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R3, R4, R5>,
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

/** @internal */
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
        sockets: MobyDemux.HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R4, R5, R6>
    ) => Effect.Effect<
        MobyDemux.CompressedDemuxOutput<A1, A2>,
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
        sockets: MobyDemux.HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R4, R5, R6>,
        io: {
            stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>;
            stdout: Sink.Sink<A1, string, L1, E2, R2>;
            stderr: Sink.Sink<A2, string, L2, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        MobyDemux.CompressedDemuxOutput<A1, A2>,
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
            ({ ranStderr, ranStdout }) => internalCompressed.compressDemuxOutput(Tuple.make(ranStdout, ranStderr))
        );
    })
);
