/**
 * Common interleaving utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

import { isMultiplexedStreamSocket, makeMultiplexedStreamSocket, MultiplexedStreamSocket } from "./Multiplexed.js";
import { makeRawStreamSocket, RawStreamSocket } from "./Raw.js";

/**
 * Interleave stdout and stderr streams back into a socket.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveBackToSocket: {
    // Interleave raw streams.
    (stdout: RawStreamSocket, stderr: RawStreamSocket): Effect.Effect<RawStreamSocket, never, never>;
    // Interleave multiplexed streams.
    (
        stdout: MultiplexedStreamSocket,
        stderr: MultiplexedStreamSocket
    ): Effect.Effect<MultiplexedStreamSocket, never, never>;
} = <T extends MultiplexedStreamSocket | RawStreamSocket>(stdout: T, stderr: T): Effect.Effect<T, never, never> =>
    Effect.gen(function* () {
        const stdoutChannel = Socket.toChannel(stdout);
        const stderrChannel = Socket.toChannel(stderr);
        const stdoutStream = Stream.pipeThroughChannelOrFail(Stream.never, stdoutChannel);
        const stderrStream = Stream.pipeThroughChannelOrFail(Stream.never, stderrChannel);
        const stream = Stream.interleave(stdoutStream, stderrStream);
        const readable = Stream.toReadableStream(stream);
        const transformStream = Effect.succeed({ readable, writable: new WritableStream() });
        const socket = yield* Socket.fromTransformStream(transformStream);
        return isMultiplexedStreamSocket(stdout)
            ? (makeMultiplexedStreamSocket(socket) as T)
            : (makeRawStreamSocket(socket) as T);
    });

/**
 * Interleave stdout and stderr streams.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveToStream: {
    // Interleave raw streams.
    (stdout: RawStreamSocket, stderr: RawStreamSocket): Stream.Stream<Uint8Array, Socket.SocketError, never>;
    // Interleave multiplexed streams.
    (
        stdout: MultiplexedStreamSocket,
        stderr: MultiplexedStreamSocket
    ): Stream.Stream<Uint8Array, Socket.SocketError, never>;
} = <T extends MultiplexedStreamSocket | RawStreamSocket>(
    stdout: T,
    stderr: T
): Stream.Stream<Uint8Array, Socket.SocketError, never> => {
    const stdoutChannel = Socket.toChannel<never>(stdout);
    const stderrChannel = Socket.toChannel<never>(stderr);
    const stdoutStream = Stream.pipeThroughChannelOrFail(Stream.never, stdoutChannel);
    const stderrStream = Stream.pipeThroughChannelOrFail(Stream.never, stderrChannel);
    return Stream.interleave(stdoutStream, stderrStream);
};
