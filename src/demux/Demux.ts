/**
 * Common demux utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { CompressedDemuxOutput, CompressedStdinStdoutStderrOutput } from "./Compressed.js";
import { demuxMultiplexedSocket, isMultiplexedStreamSocket, MultiplexedStreamSocket } from "./Multiplexed.js";
import { demuxRawSocket, demuxRawSockets, isRawStreamSocket, RawStreamSocket } from "./Raw.js";

/** @since 1.0.0 */
export declare namespace Demux {
    /**
     * @since 1.0.0
     * @category Types
     */
    export type StdinStdoutStderrSocketOptions =
        | { stdin: RawStreamSocket; stdout?: never; stderr?: never }
        | { stdin?: never; stdout: RawStreamSocket; stderr?: never }
        | { stdin?: never; stdout?: never; stderr: RawStreamSocket }
        | { stdin: RawStreamSocket; stdout: RawStreamSocket; stderr?: never }
        | { stdin: RawStreamSocket; stdout?: never; stderr: RawStreamSocket }
        | { stdin?: never; stdout: RawStreamSocket; stderr: RawStreamSocket }
        | { stdin: RawStreamSocket; stdout: RawStreamSocket; stderr: RawStreamSocket };

    /**
     * @since 1.0.0
     * @category Types
     */
    export type AnySocketOptions = RawStreamSocket | MultiplexedStreamSocket | StdinStdoutStderrSocketOptions;
}

/**
 * Demux either a raw socket, multiplexed socket, or multiple raw socket(s) to a
 * single sink.
 *
 * @since 1.0.0
 * @category Demux
 * @example
 *     // Demux a single raw socket to one sink
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/DockerEngine";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 Tty: true,
 *                 OpenStdin: true,
 *                 Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"'],
 *             },
 *         });
 *
 *         // Since the container was started with "tty: true",
 *         // we should get a raw socket here
 *         const socket:
 *             | MobyDemux.RawStreamSocket
 *             | MobyDemux.MultiplexedStreamSocket = yield* containers.attach({
 *             stdin: true,
 *             stdout: true,
 *             stderr: true,
 *             stream: true,
 *             id: containerId,
 *         });
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(socket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const input = Stream.concat(Stream.make("a\n"), Stream.never);
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             socket,
 *             input,
 *             Sink.collectAll<string>()
 *         );
 *         assert.strictEqual(
 *             Chunk.join(data, ""),
 *             "a\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\nHi2\r\n"
 *         );
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 *
 * @example
 *     // Demux a multiplexed socket to one sink
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/DockerEngine";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 // Tty: true,
 *                 OpenStdin: true,
 *                 Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"'],
 *             },
 *         });
 *
 *         // Since the container was started with "tty: false",
 *         // we should get a multiplexed socket here
 *         const socket:
 *             | MobyDemux.RawStreamSocket
 *             | MobyDemux.MultiplexedStreamSocket = yield* containers.attach({
 *             stdin: true,
 *             stdout: true,
 *             stderr: true,
 *             stream: true,
 *             id: containerId,
 *         });
 *         assert.ok(
 *             MobyDemux.isMultiplexedStreamSocket(socket),
 *             "Expected a multiplexed stream socket"
 *         );
 *
 *         // Demux to a single sink
 *         const input = Stream.concat(Stream.make("a\n"), Stream.never);
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             socket,
 *             input,
 *             Sink.collectAll<string>()
 *         );
 *         assert.strictEqual(
 *             Chunk.join(data, ""),
 *             "d41d8cd98f00b204e9800998ecf8427e  -\nHi2\n"
 *         );
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 *
 * @example
 *     // Demux multiple raw sockets to one sink
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as NodeSocket from "@effect/platform-node/NodeSocket";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 // Tty: true,
 *                 OpenStdin: true,
 *                 Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"'],
 *             },
 *         });
 *
 *         // It doesn't matter what tty option we start the container
 *         // with here, we will only get a raw socket
 *         const stdinSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdin: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         const stdoutSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdout: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         const stderrSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stderr: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdinSocket),
 *             "Expected a raw socket"
 *         );
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdoutSocket),
 *             "Expected a raw socket"
 *         );
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stderrSocket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             {
 *                 stdin: stdinSocket,
 *                 stdout: stdoutSocket,
 *                 stderr: stderrSocket,
 *             },
 *             Stream.concat(Stream.make("a\n"), Stream.never),
 *             Sink.collectAll<string>()
 *         );
 *
 *         assert.ok(
 *             [
 *                 // When tty: false
 *                 "d41d8cd98f00b204e9800998ecf8427e  -\nHi2\n",
 *                 "Hi2\nd41d8cd98f00b204e9800998ecf8427e  -\n",
 *                 // When tty: true
 *                 "a\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\nHi2\r\n",
 *                 "a\r\nHi2\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\n",
 *             ].includes(Chunk.join(data, ""))
 *         );
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
 *         .pipe(NodeRuntime.runMain);
 *
 * @example
 *     // Demux a single raw socket to one sink
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as NodeSocket from "@effect/platform-node/NodeSocket";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 // Tty: true,
 *                 AttachStdout: true,
 *                 Cmd: [
 *                     "bash",
 *                     "-c",
 *                     'sleep 2s && echo "Hi" && >&2 echo "Hi2"',
 *                 ],
 *             },
 *         });
 *
 *         // It doesn't matter what tty option we start the container
 *         // with here, we will only get a raw socket
 *         const stdoutSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdout: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdoutSocket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             { stdout: stdoutSocket },
 *             Stream.concat(Stream.make("a\n"), Stream.never),
 *             Sink.collectAll<string>()
 *         );
 *         assert.strictEqual(Chunk.join(data, ""), "Hi\n");
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
 *         .pipe(NodeRuntime.runMain);
 */
export const demuxToSingleSink: {
    // Demux a single raw socket to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    // Demux a single raw socket to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        socket: RawStreamSocket
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;

    // Demux a multiplexed socket to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Demux a multiplexed socket to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: MultiplexedStreamSocket
    ) => Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;

    // Demux multiple raw sockets to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        sockets: Demux.StdinStdoutStderrSocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
    // Demux multiple raw sockets to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        sockets: Demux.StdinStdoutStderrSocketOptions
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>;
} = Function.dual(
    /**
     * We are data-first if the first argument is a socket or if the first
     * argument is an object with a "stdout", "stderr", or "stdin" key.
     */
    (arguments_) =>
        arguments_[0][Socket.TypeId] !== undefined ||
        "stdin" in arguments_[0] ||
        "stdout" in arguments_[0] ||
        "stderr" in arguments_[0],
    <A1, E1, E2, R1, R2>(
        socketOptions: Demux.AnySocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    > => {
        if ("stdin" in socketOptions || "stdout" in socketOptions || "stderr" in socketOptions) {
            return demuxRawSockets(socketOptions, source, sink, options);
        }

        if (isRawStreamSocket(socketOptions)) {
            return demuxRawSocket(socketOptions, source, sink, options);
        }

        if (isMultiplexedStreamSocket(socketOptions)) {
            return demuxMultiplexedSocket(socketOptions, source, sink, options);
        }

        return Function.absurd(socketOptions);
    }
);

/**
 * Like {@link demuxToSingleSink}, but with unknown input socket.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxUnknownToSingleSink: {
    // Any socket input to one sink, data-last signature.
    <A1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: Demux.AnySocketOptions
    ) => Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
    // Any socket input to one sink, data-first signature.
    <A1, E1, E2, R1, R2>(
        socket: Demux.AnySocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, string, E2, R2>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
    >;
} =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    demuxToSingleSink as any;

/**
 * Demux either a multiplexed socket or multiple raw socket to separate sinks.
 * If you need to also demux a single raw socket, then use
 * {@link demuxUnknownToSeparateSinks} instead.
 *
 * @since 1.0.0
 * @category Demux
 * @example
 *     // Demux a multiplexed socket to two sinks
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/DockerEngine";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 // Tty: true,
 *                 OpenStdin: true,
 *                 Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"'],
 *             },
 *         });
 *
 *         // Since the container was started with "tty: false",
 *         // we should get a multiplexed socket here
 *         const socket:
 *             | MobyDemux.RawStreamSocket
 *             | MobyDemux.MultiplexedStreamSocket = yield* containers.attach({
 *             stdin: true,
 *             stdout: true,
 *             stderr: true,
 *             stream: true,
 *             id: containerId,
 *         });
 *         assert.ok(
 *             MobyDemux.isMultiplexedStreamSocket(socket),
 *             "Expected a multiplexed stream socket"
 *         );
 *
 *         // Demux to a single sink
 *         const [stdoutData, stderrData] =
 *             yield* MobyDemux.demuxToSeparateSinks(
 *                 socket,
 *                 Stream.concat(Stream.make("a\n"), Stream.never),
 *                 Sink.collectAll<string>(),
 *                 Sink.collectAll<string>()
 *             );
 *         assert.strictEqual(
 *             Chunk.join(stdoutData, ""),
 *             "d41d8cd98f00b204e9800998ecf8427e  -\n"
 *         );
 *         assert.strictEqual(Chunk.join(stderrData, ""), "Hi2\n");
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 *
 * @example
 *     // Demux multiple raw sockets to two sinks
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as NodeSocket from "@effect/platform-node/NodeSocket";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 // Tty: true,
 *                 OpenStdin: true,
 *                 Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"'],
 *             },
 *         });
 *
 *         // It doesn't matter what tty option we start the container
 *         // with here, we will only get a raw socket
 *         const stdinSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdin: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         const stdoutSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdout: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         const stderrSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stderr: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdinSocket),
 *             "Expected a raw socket"
 *         );
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdoutSocket),
 *             "Expected a raw socket"
 *         );
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stderrSocket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const [stdoutData, stderrData] =
 *             yield* MobyDemux.demuxToSeparateSinks(
 *                 {
 *                     stdin: stdinSocket,
 *                     stdout: stdoutSocket,
 *                     stderr: stderrSocket,
 *                 },
 *                 Stream.concat(Stream.make("a\n"), Stream.never),
 *                 Sink.collectAll<string>(),
 *                 Sink.collectAll<string>()
 *             );
 *         assert.strictEqual(
 *             Chunk.join(stdoutData, ""),
 *             "d41d8cd98f00b204e9800998ecf8427e  -\n"
 *         );
 *         assert.strictEqual(Chunk.join(stderrData, ""), "Hi2\n");
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
 *         .pipe(NodeRuntime.runMain);
 *
 * @example
 *     // Demux single raw socket to two sinks
 *     import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
 *     import * as NodeSocket from "@effect/platform-node/NodeSocket";
 *     import * as Chunk from "effect/Chunk";
 *     import * as Effect from "effect/Effect";
 *     import * as Function from "effect/Function";
 *     import * as Layer from "effect/Layer";
 *     import * as Sink from "effect/Sink";
 *     import * as Stream from "effect/Stream";
 *
 *     import * as MobyConnection from "the-moby-effect/MobyConnection";
 *     import * as MobyConvey from "the-moby-effect/MobyConvey";
 *     import * as MobyDemux from "the-moby-effect/MobyDemux";
 *     import * as MobyEndpoints from "the-moby-effect/MobyEndpoints";
 *     import * as DockerEngine from "the-moby-effect/DockerEngine";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
 *         Effect.map(DockerEngine.layerNodeJS),
 *         Layer.unwrapEffect
 *     );
 *
 *     Effect.gen(function* () {
 *         const image = "ubuntu:latest";
 *         const containers = yield* MobyEndpoints.Containers;
 *
 *         // Pull the image, which will be removed when the scope is closed
 *         const pullStream = DockerEngine.pull({ image });
 *         yield* MobyConvey.followProgressInConsole(pullStream);
 *
 *         // Start a container, which will be removed when the scope is closed
 *         const { Id: containerId } = yield* DockerEngine.runScoped({
 *             spec: {
 *                 Image: image,
 *                 // Tty: true,
 *                 AttachStdout: true,
 *                 Cmd: [
 *                     "bash",
 *                     "-c",
 *                     'sleep 2s && echo "Hi" && >&2 echo "Hi2"',
 *                 ],
 *             },
 *         });
 *
 *         // It doesn't matter what tty option we start the container
 *         // with here, we will only get a raw socket
 *         const stdoutSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket({
 *                 stdout: true,
 *                 stream: true,
 *                 id: containerId,
 *             });
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdoutSocket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const [stdoutData, stderrData] =
 *             yield* MobyDemux.demuxToSeparateSinks(
 *                 { stdout: stdoutSocket },
 *                 Stream.concat(Stream.make("a\n"), Stream.never),
 *                 Sink.collectAll<string>(),
 *                 Sink.collectAll<string>()
 *             );
 *         assert.strictEqual(Chunk.join(stdoutData, ""), "Hi\n");
 *         assert.strictEqual(stderrData, undefined);
 *
 *         // Wait for the container to exit
 *         yield* containers.wait({ id: containerId });
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
 *         .pipe(NodeRuntime.runMain);
 */
export const demuxToSeparateSinks: {
    // Demux a multiplexed socket to two sinks, data-first signature.
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
    // Demux a multiplexed socket to two sinks, data-last signature.
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

    // Demux multiple raw sockets to two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
        sockets: SocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux multiple raw sockets to two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        sockets: SocketOptions
    ) => Effect.Effect<
        CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    /**
     * We are data-first if the first argument is a socket or if the first
     * argument is an object with a "stdout", "stderr", or "stdin" key.
     */
    (arguments_) =>
        arguments_[0][Socket.TypeId] !== undefined ||
        "stdin" in arguments_[0] ||
        "stdout" in arguments_[0] ||
        "stderr" in arguments_[0],
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socketOptions: MultiplexedStreamSocket | Demux.StdinStdoutStderrSocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        if ("stdin" in socketOptions || "stdout" in socketOptions || "stderr" in socketOptions) {
            const stdinTuple = Predicate.isNotUndefined(socketOptions.stdin)
                ? { stdin: Tuple.make(source, socketOptions.stdin) }
                : {};
            const stdoutTuple = Predicate.isNotUndefined(socketOptions.stdout)
                ? { stdout: Tuple.make(socketOptions.stdout, sink1) }
                : {};
            const stderrTuple = Predicate.isNotUndefined(socketOptions.stderr)
                ? { stderr: Tuple.make(socketOptions.stderr, sink2) }
                : {};
            return demuxRawSockets({ ...stdinTuple, ...stdoutTuple, ...stderrTuple });
        }

        return demuxMultiplexedSocket(socketOptions, source, sink1, sink2, options);
    }
);

/**
 * Demux a single raw socket, multiplexed socket, or multiple raw sockets to two
 * sinks. If given a single raw stream socket, then stdout and stderr will be
 * combined on the same sink. If given a multiplexed stream socket, then stdout
 * and stderr will be forwarded to different sinks. If given multiple raw stream
 * sockets, then you can choose which ones to provide. The return type will
 * depend on the type of socket provided, so this isn't suitable for all use
 * cases. If you need a unified signature, you should use
 * {@link demuxUnknownToSeparateSinks}.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxAnyToSeparateSinks: {
    // Demux a single raw socket, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux a single raw socket, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        socket: RawStreamSocket
    ) => Effect.Effect<
        A1,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;

    // Demux a multiplexed socket to two sinks, data-first signature.
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
    // Demux a multiplexed socket to two sinks, data-last signature.
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

    // Demux multiple raw sockets to two sinks, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
        sockets: SocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Demux multiple raw sockets to two sinks, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { encoding?: string | undefined } | undefined
    ): (
        sockets: SocketOptions
    ) => Effect.Effect<
        CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
        E1 | E2 | E3 | Socket.SocketError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = Function.dual(
    /**
     * We are data-first if the first argument is a socket or if the first
     * argument is an object with a "stdout", "stderr", or "stdin" key.
     */
    (arguments_) =>
        arguments_[0][Socket.TypeId] !== undefined ||
        "stdin" in arguments_[0] ||
        "stdout" in arguments_[0] ||
        "stderr" in arguments_[0],
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socketOptions: Demux.AnySocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        void | A1 | CompressedDemuxOutput<A1, A2>,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        if (isRawStreamSocket(socketOptions)) {
            return demuxRawSocket(socketOptions, source, sink1, options);
        }

        if (isMultiplexedStreamSocket(socketOptions)) {
            return demuxToSeparateSinks(socketOptions, source, sink1, sink2, options);
        }

        return demuxToSeparateSinks(socketOptions, source, sink1, sink2, options);
    }
);

/**
 * Like {@link demuxAnyToSeparateSinks}, but with unknown sockets and a unified
 * signature.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxUnknownToSeparateSinks: {
    // Any socket input to one sink, data-last signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): (
        socket: Demux.AnySocketOptions
    ) => Effect.Effect<
        void,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    // Any socket input to one sink, data-first signature.
    <A1, A2, E1, E2, E3, R1, R2, R3>(
        socket: Demux.AnySocketOptions,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink1: Sink.Sink<A1, string, string, E2, R2>,
        sink2: Sink.Sink<A2, string, string, E3, R3>,
        options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
    ): Effect.Effect<
        void,
        E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    demuxAnyToSeparateSinks as any;
