/**
 * Demux utilities for raw sockets. Raw sockets come in two "flavors" -
 * unidirectional and bidirectional. In both cases, they are represented as
 * bidirectional sockets because even in the unidirectional case data could be
 * flowing in either direction. Unlike multiplexed sockets, bidirectional raw
 * sockets can not differentiate between stdout and stderr because the data is
 * just raw bytes from the process's PTY. However, you can attach multiple
 * unidirectional sockets to the same container (one for stdout and one for
 * stderr) and then use the demux utilities to separate the streams.
 *
 * Upcasting and downcasting between the two types is supported, but discouraged
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
 * @category Constructors
 */
export const makeBidirectionalRawStreamSocket = (socket: Socket.Socket): BidirectionalRawStreamSocket => ({
    ...socket,
    "content-type": RawStreamSocketContentType,
    [BidirectionalRawStreamSocketTypeId]: BidirectionalRawStreamSocketTypeId,
});

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
 * @category Constructors
 */
export const makeUnidirectionalRawStreamSocket = (socket: Socket.Socket): UnidirectionalRawStreamSocket => ({
    ...socket,
    "content-type": RawStreamSocketContentType,
    [UnidirectionalRawStreamSocketTypeId]: UnidirectionalRawStreamSocketTypeId,
});

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
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * To demux multiple raw sockets, you should use
 * {@link demuxUnidirectionalRawSockets}
 *
 * @since 1.0.0
 * @category Demux
 * @example
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as Convey from "the-moby-effect/Convey";
 *     import * as Platforms from "the-moby-effect/Platforms";
 *     import * as DemuxMultiplexed from "the-moby-effect/demux/Multiplexed";
 *     import * as DemuxRaw from "the-moby-effect/demux/Raw";
 *     import * as Containers from "the-moby-effect/endpoints/Containers";
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         Platforms.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* Containers.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* Convey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 Tty: true,
 *                 Cmd: [
 *                     "bash",
 *                     "-c",
 *                     'sleep 2s && echo "Hi" && >&2 echo "Hi2"',
 *                 ],
 *             },
 *         });
 *
 *         // Since the container was started with "tty: true", we should get a raw socket here
 *         const socket:
 *             | DemuxRaw.BidirectionalRawStreamSocket
 *             | DemuxMultiplexed.MultiplexedStreamSocket =
 *             yield* containers.attach({
 *                 stdout: true,
 *                 stderr: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *
 *         assert.ok(
 *             DemuxRaw.isBidirectionalRawStreamSocket(socket),
 *             "Expected a bidirectional raw socket"
 *         );
 *
 *         const data = yield* DemuxRaw.demuxBidirectionalRawSocket(
 *             socket,
 *             Stream.never,
 *             Sink.collectAll<string>()
 *         );
 *         assert.deepStrictEqual(Chunk.toReadonlyArray(data), [
 *             "Hi\r\nHi2\r\n",
 *         ]);
 *
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 *
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxBidirectionalRawSocket = Function.dual<
    // Data-last version
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => (
        socket: BidirectionalRawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>,
    // Data-first version
    <A1, E1, E2, R1, R2>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
>(
    (arguments_) => isBidirectionalRawStreamSocket(arguments_[0]),
    <A1, E1, E2, R1, R2>(
        socket: BidirectionalRawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.decodeText(options?.encoding ?? "utf-8"),
            Stream.run(sink)
        )
);

/**
 * Demux multiple raw sockets, created from multiple container attach websocket
 * requests. If no options are provided for a given stream, it will be ignored.
 * This is really just an Effect.all wrapper around
 * {@link demuxBidirectionalRawSocket}.
 *
 * To demux a single raw socket, you should use
 * {@link demuxBidirectionalRawSocket}
 *
 * @since 1.0.0
 * @category Demux
 * @example
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as NodeSocket from "@effect/platform-node/NodeSocket";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *     import * as Tuple from "effect/Tuple";
 *
 *     import * as Convey from "the-moby-effect/Convey";
 *     import * as Platforms from "the-moby-effect/Platforms";
 *     import * as DemuxRaw from "the-moby-effect/demux/Raw";
 *     import * as Containers from "the-moby-effect/endpoints/Containers";
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         Platforms.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* Containers.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* Convey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 Tty: false,
 *                 Cmd: [
 *                     "bash",
 *                     "-c",
 *                     'sleep 2s && echo "Hi" && >&2 echo "Hi2"',
 *                 ],
 *             },
 *         });
 *
 *         // It doesn't matter what tty option we start the container with here, we will only get a unidirectional socket
 *         const stdinSocket: DemuxRaw.UnidirectionalRawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdin: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         const stdoutSocket: DemuxRaw.UnidirectionalRawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdout: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         const stderrSocket: DemuxRaw.UnidirectionalRawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stderr: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *
 *         assert.ok(
 *             DemuxRaw.isUnidirectionalRawStreamSocket(stdinSocket),
 *             "Expected a unidirectional raw socket"
 *         );
 *         assert.ok(
 *             DemuxRaw.isUnidirectionalRawStreamSocket(stdoutSocket),
 *             "Expected a unidirectional raw socket"
 *         );
 *         assert.ok(
 *             DemuxRaw.isUnidirectionalRawStreamSocket(stderrSocket),
 *             "Expected a unidirectional raw socket"
 *         );
 *
 *         const [stdoutData, stderrData] =
 *             yield* DemuxRaw.demuxUnidirectionalRawSockets({
 *                 stdin: Tuple.make(Stream.never, stdinSocket),
 *                 stdout: Tuple.make(stdoutSocket, Sink.collectAll<string>()),
 *                 stderr: Tuple.make(stderrSocket, Sink.collectAll<string>()),
 *             });
 *
 *         assert.deepStrictEqual(Chunk.toReadonlyArray(stdoutData), ["Hi\n"]);
 *         assert.deepStrictEqual(Chunk.toReadonlyArray(stderrData), ["Hi2\n"]);
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
 *         .pipe(NodeRuntime.runMain);
 *
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttachWebsocket
 */
export const demuxUnidirectionalRawSockets: {
    // Multiple sinks, data-first combined version
    <
        O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, UnidirectionalRawStreamSocket],
        O2 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        O3 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        S = UnidirectionalRawStreamSocket,
        E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, S] ? E : never,
        E2 = O2 extends [S, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        E3 = O3 extends [S, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, S] ? R : never,
        R2 = O2 extends [S, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        R3 = O3 extends [S, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        A1 = O2 extends [S, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
        A2 = O3 extends [S, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
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
    // Multiple sinks, data-first version
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        sockets: {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        },
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
    // Multiple sinks, data-last version
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        io: {
            stdin: Stream.Stream<string | Uint8Array, E1, R1>;
            stdout: Sink.Sink<A1, string, string, E2, R2>;
            stderr: Sink.Sink<A2, string, string, E3, R3>;
        },
        options?: { encoding?: string | undefined } | undefined
    ): (sockets: {
        stdout: UnidirectionalRawStreamSocket;
        stdin?: UnidirectionalRawStreamSocket | undefined;
        stderr?: UnidirectionalRawStreamSocket | undefined;
    }) => Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Single sink, data-first version
    <A1, E1, E2, R1, R2>(
        sockets: {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        },
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    // Single sink, data-last version
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): (sockets: {
        stdout: UnidirectionalRawStreamSocket;
        stdin?: UnidirectionalRawStreamSocket | undefined;
        stderr?: UnidirectionalRawStreamSocket | undefined;
    }) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
} = Function.dual(
    (arguments_) =>
        !(
            arguments_[0][Stream.StreamTypeId] !== undefined ||
            ("stdin" in arguments_[0] && arguments_[0]["stdin"][Stream.StreamTypeId] !== undefined)
        ),
    <
        O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, UnidirectionalRawStreamSocket],
        O2 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        O3 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
        S = UnidirectionalRawStreamSocket,
        E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, S] ? E : never,
        E2 = O2 extends [S, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        E3 = O3 extends [S, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
        R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, S] ? R : never,
        R2 = O2 extends [S, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        R3 = O3 extends [S, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
        A1 = O2 extends [S, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
        A2 = O3 extends [S, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
    >(
        sockets:
            | { stdin: O1; stdout?: never; stderr?: never }
            | { stdin?: never; stdout: O2; stderr?: never }
            | { stdin?: never; stdout?: never; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr?: never }
            | { stdin: O1; stdout?: never; stderr: O3 }
            | { stdin?: never; stdout: O2; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr: O3 }
            | {
                  stdout: UnidirectionalRawStreamSocket;
                  stdin?: UnidirectionalRawStreamSocket | undefined;
                  stderr?: UnidirectionalRawStreamSocket | undefined;
              },
        sourceOrOptions?: Stream.Stream<string | Uint8Array, E1, R1> | { encoding?: string | undefined } | undefined,
        sink?: Sink.Sink<A1, string, string, E2, R2> | undefined,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        type S1 = Stream.Stream<string | Uint8Array, E1, R1>;
        type S2 = Sink.Sink<A1, string, string, E2, R2>;
        type S3 = Sink.Sink<A2, string, string, E3, R3>;
        type StdinEffect = Effect.Effect<void, E1 | Socket.SocketError, Exclude<R1, Scope.Scope>>;
        type StdoutEffect = Effect.Effect<A1, E2 | Socket.SocketError, Exclude<R2, Scope.Scope>>;
        type StderrEffect = Effect.Effect<A2, E3 | Socket.SocketError, Exclude<R3, Scope.Scope>>;

        type RegularInput = {
            stdout: UnidirectionalRawStreamSocket;
            stdin?: UnidirectionalRawStreamSocket | undefined;
            stderr?: UnidirectionalRawStreamSocket | undefined;
        };
        type CombinedInput =
            | { stdin: O1; stdout?: never; stderr?: never }
            | { stdin?: never; stdout: O2; stderr?: never }
            | { stdin?: never; stdout?: never; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr?: never }
            | { stdin: O1; stdout?: never; stderr: O3 }
            | { stdin?: never; stdout: O2; stderr: O3 }
            | { stdin: O1; stdout: O2; stderr: O3 };

        const willMerge = (sourceOrOptions as S1 | undefined)?.[Stream.StreamTypeId] !== undefined;

        if (willMerge) {
            const sinkForBoth = sink as S2;
            const sourceStream = sourceOrOptions as S1;
            const { stderr, stdin, stdout } = sockets as RegularInput;

            const transformToStream = (
                socket: UnidirectionalRawStreamSocket
            ): Stream.Stream<string, Socket.SocketError, never> =>
                Function.pipe(
                    Stream.never,
                    Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
                    Stream.decodeText(options?.encoding ?? "utf-8")
                );

            const mergedStream = Stream.merge(
                transformToStream(stdout),
                Predicate.isNotUndefined(stderr) ? transformToStream(stderr) : Stream.empty
            );

            const runStdin: StdinEffect = Predicate.isNotUndefined(stdin)
                ? demuxBidirectionalRawSocket(
                      upcastUnidirectionalToBidirectional(stdin),
                      sourceStream,
                      Sink.drain,
                      options
                  )
                : Effect.void;

            const runMerged: StdoutEffect = Stream.run(mergedStream, sinkForBoth);

            return Effect.map(
                Effect.all({ ranStdin: runStdin, ranMerged: runMerged }, { concurrency: 2 }),
                ({ ranMerged }) => ranMerged
            );
        }

        const { stderr, stdin, stdout } = sockets as CombinedInput;

        const runStdin: StdinEffect = Predicate.isNotUndefined(stdin)
            ? demuxBidirectionalRawSocket(
                  upcastUnidirectionalToBidirectional(stdin[1]),
                  stdin[0] as S1,
                  Sink.drain,
                  options
              )
            : Effect.void;

        const runStdout: StdoutEffect = Predicate.isNotUndefined(stdout)
            ? demuxBidirectionalRawSocket(
                  upcastUnidirectionalToBidirectional(stdout[0]),
                  Stream.never,
                  stdout[1] as S2,
                  options
              )
            : Function.unsafeCoerce(Effect.void);

        const runStderr: StderrEffect = Predicate.isNotUndefined(stderr)
            ? demuxBidirectionalRawSocket(
                  upcastUnidirectionalToBidirectional(stderr[0]),
                  Stream.never,
                  stderr[1] as S3,
                  options
              )
            : Function.unsafeCoerce(Effect.void);

        return Effect.map(
            Effect.all({ ranStdin: runStdin, ranStdout: runStdout, ranStderr: runStderr }, { concurrency: 3 }),
            ({ ranStderr, ranStdout }) => compressDemuxOutput(Tuple.make(ranStdout, ranStderr))
        );
    }
);
