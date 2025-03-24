/**
 * Common interleaving utilities for hijacked docker streams.
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as Stream from "effect/Stream";

import { asRawStreamChannel, isRawStreamChannel, RawStreamChannel, RawStreamSocket, toStream } from "./raw.js";

/**
 * Interleaves an stdout socket with an stderr socket.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveToStream = <
    IE1 = unknown,
    IE2 = unknown,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: RawStreamSocket | RawStreamChannel<IE1, OE1, R1>,
    stderr: RawStreamSocket | RawStreamChannel<IE2, OE2, R2>
): Stream.Stream<Uint8Array, IE1 | IE2 | OE1 | OE2, R1 | R2> => {
    const stdoutChannel = isRawStreamChannel<IE1, OE1, R1>(stdout)
        ? (stdout as RawStreamChannel<IE1, OE1, R1>)
        : (asRawStreamChannel<IE1>(stdout) as unknown as RawStreamChannel<IE1, OE1, R1>);

    const stderrChannel = isRawStreamChannel<IE2, OE2, R2>(stderr)
        ? (stderr as RawStreamChannel<IE2, OE2, R2>)
        : (asRawStreamChannel<IE2>(stderr) as unknown as RawStreamChannel<IE2, OE2, R2>);

    return Stream.interleave(toStream(stdoutChannel), toStream(stderrChannel));
};

/**
 * Interleaves an stdout socket with an stderr socket and tags the output
 * stream.
 *
 * @since 1.0.0
 * @category Interleave
 */
export const interleaveToTaggedStream = <
    IE1 = unknown,
    IE2 = unknown,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: RawStreamSocket | RawStreamChannel<IE1, OE1, R1>,
    stderr: RawStreamSocket | RawStreamChannel<IE2, OE2, R2>,
    options?: { bufferSize?: number | undefined } | undefined
): Stream.Stream<
    { _tag: "stdout"; value: Uint8Array } | { _tag: "stderr"; value: Uint8Array },
    IE1 | IE2 | OE1 | OE2,
    R1 | R2
> => {
    const stdoutChannel = isRawStreamChannel<IE1, OE1, R1>(stdout)
        ? (stdout as RawStreamChannel<IE1, OE1, R1>)
        : (asRawStreamChannel<IE1>(stdout) as unknown as RawStreamChannel<IE1, OE1, R1>);

    const stderrChannel = isRawStreamChannel<IE2, OE2, R2>(stderr)
        ? (stderr as RawStreamChannel<IE2, OE2, R2>)
        : (asRawStreamChannel<IE2>(stderr) as unknown as RawStreamChannel<IE2, OE2, R2>);

    return Stream.mergeWithTag(
        { stdout: toStream(stdoutChannel), stderr: toStream(stderrChannel) } as const,
        { concurrency: "unbounded", ...options } as const
    );
};
