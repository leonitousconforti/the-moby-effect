/**
 * Common interleaving utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as Stream from "effect/Stream";

import { rawSocketToStream, RawStreamSocket } from "./Raw.js";

/**
 * Interleaves an stdout socket with an stderr socket.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveToStream = (
    stdout: RawStreamSocket,
    stderr: RawStreamSocket
): Stream.Stream<Uint8Array, Socket.SocketError, never> =>
    Stream.interleave(rawSocketToStream(stdout), rawSocketToStream(stderr));

/**
 * Interleaves an stdout socket with an stderr socket and tags the output
 * stream.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveToTaggedStream = (
    stdout: RawStreamSocket,
    stderr: RawStreamSocket,
    options?: { bufferSize?: number | undefined } | undefined
): Stream.Stream<
    { _tag: "stdout"; value: Uint8Array } | { _tag: "stderr"; value: Uint8Array },
    Socket.SocketError,
    never
> =>
    Stream.mergeWithTag(
        { stdout: rawSocketToStream(stdout), stderr: rawSocketToStream(stderr) } as const,
        { concurrency: "unbounded", ...options } as const
    );
