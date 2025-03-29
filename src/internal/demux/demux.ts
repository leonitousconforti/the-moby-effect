/**
 * Common demux utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as ParseResult from "effect/ParseResult";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import {
    demuxMultiplexedToSingleSink,
    EitherMultiplexedInput,
    isMultiplexedChannel,
    isMultiplexedSocket,
} from "./multiplexed.js";
import { demuxRawToSingleSink, EitherRawInput, isRawChannel, isRawSocket } from "./raw.js";

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
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
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
 *             | MobyDemux.MultiplexedStreamSocket = yield* containers.attach(
 *             containerId,
 *             {
 *                 stdin: true,
 *                 stdout: true,
 *                 stderr: true,
 *                 stream: true,
 *             }
 *         );
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(socket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const input = Stream.make("a\n");
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             socket,
 *             input,
 *             Sink.mkString
 *         );
 *         assert.strictEqual(
 *             data,
 *             "a\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\nHi2\r\n"
 *         );
 *
 *         // Wait for the container to exit
 *         yield* containers.wait(containerId);
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
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
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
 *             | MobyDemux.MultiplexedStreamSocket = yield* containers.attach(
 *             containerId,
 *             {
 *                 stdin: true,
 *                 stdout: true,
 *                 stderr: true,
 *                 stream: true,
 *             }
 *         );
 *         assert.ok(
 *             MobyDemux.isMultiplexedStreamSocket(socket),
 *             "Expected a multiplexed stream socket"
 *         );
 *
 *         // Demux to a single sink
 *         const input = Stream.make("a\n");
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             socket,
 *             input,
 *             Sink.mkString
 *         );
 *         assert.strictEqual(
 *             data,
 *             "d41d8cd98f00b204e9800998ecf8427e  -\nHi2\n"
 *         );
 *
 *         // Wait for the container to exit
 *         yield* containers.wait(containerId);
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 *
 * @example
 *     // Demux multiple raw sockets to one sink
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
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
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
 *             yield* containers.attachWebsocket(containerId, {
 *                 stdin: true,
 *                 stream: true,
 *             });
 *         const stdoutSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket(containerId, {
 *                 stdout: true,
 *                 stream: true,
 *             });
 *         const stderrSocket: MobyDemux.RawStreamSocket =
 *             yield* containers.attachWebsocket(containerId, {
 *                 stderr: true,
 *                 stream: true,
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
 *             Stream.make("a\n"),
 *             Sink.mkString
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
 *             ].includes(data)
 *         );
 *
 *         // Wait for the container to exit
 *         yield* containers.wait(containerId);
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 *
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
 *     import * as DockerEngine from "the-moby-effect/engines/Docker";
 *
 *     const layer = Function.pipe(
 *         MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
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
 *             yield* containers.attachWebsocket(containerId, {
 *                 stdout: true,
 *                 stream: true,
 *             });
 *         assert.ok(
 *             MobyDemux.isRawStreamSocket(stdoutSocket),
 *             "Expected a raw socket"
 *         );
 *
 *         // Demux to a single sink
 *         const data = yield* MobyDemux.demuxToSingleSink(
 *             { stdout: stdoutSocket },
 *             Stream.make("a\n"),
 *             Sink.mkString
 *         );
 *         assert.strictEqual(data, "Hi\n");
 *
 *         // Wait for the container to exit
 *         yield* containers.wait(containerId);
 *     })
 *         .pipe(Effect.scoped)
 *         .pipe(Effect.provide(layer))
 *         .pipe(NodeRuntime.runMain);
 */
export const demuxToSingleSink = Function.dual<
    // Data-last signature.
    <A1, L1, E1, E2, R1, R2>(
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => <IE = never, OE = Socket.SocketError, R3 = never>(
        sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >,
    // Data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ) => Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >
>(
    /**
     * We are data-first if the first argument is a channel or if the first
     * argument is an object with a "stdout", "stderr", or "stdin" key.
     */
    (arguments_) =>
        isRawSocket(arguments_[0]) ||
        isRawChannel(arguments_[0]) ||
        isMultiplexedSocket(arguments_[0]) ||
        isMultiplexedChannel(arguments_[0]),

    // Implementation, need the type parameters for checking the underlying.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        socketOptions: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    > => {
        if (isRawSocket(socketOptions) || isRawChannel<E1 | IE, OE, R3>(socketOptions)) {
            return demuxRawToSingleSink(socketOptions, source, sink, options);
        }

        if (isMultiplexedSocket(socketOptions) || isMultiplexedChannel<E1 | IE, OE, R3>(socketOptions)) {
            return demuxMultiplexedToSingleSink(socketOptions, source, Sink.mapInput(sink, Tuple.getSecond), options);
        }

        return Function.absurd(socketOptions);
    }
);
