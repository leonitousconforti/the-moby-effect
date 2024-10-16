/**
 * Compressing utilities for demuxing.
 *
 * @since 1.0.0
 */

import * as Predicate from "effect/Predicate";

import type { Demux } from "./Demux.js";
import type { RawStreamSocket } from "./Raw.js";

/**
 * @since 1.0.0
 * @category Types
 */
export type CompressedDemuxOutput<A1, A2> = A1 extends undefined | void
    ? A2 extends undefined | void
        ? void
        : readonly [stdout: undefined, stderr: A2]
    : A2 extends undefined | void
      ? readonly [stdout: A1, stderr: undefined]
      : readonly [stdout: A1, stderr: A2];

/**
 * @since 1.0.0
 * @category Types
 */
export type CompressedStdinStdoutStderrOutput<
    SocketOptions extends Demux.StdinStdoutStderrSocketOptions,
    A1,
    A2,
> = SocketOptions["stdout"] extends RawStreamSocket
    ? SocketOptions["stderr"] extends RawStreamSocket
        ? CompressedDemuxOutput<A1, A2>
        : CompressedDemuxOutput<A1, void>
    : SocketOptions["stderr"] extends RawStreamSocket
      ? CompressedDemuxOutput<void, A2>
      : CompressedDemuxOutput<void, void>;

/**
 * @since 1.0.0
 * @category Demux Helpers
 */
export const compressDemuxOutput = <A1, A2>(
    data: readonly [ranStdout: A1, ranStderr: A2]
): CompressedDemuxOutput<A1, A2> =>
    Predicate.isUndefined(data[0]) && Predicate.isUndefined(data[1])
        ? (void undefined as CompressedDemuxOutput<A1, A2>)
        : (data as CompressedDemuxOutput<A1, A2>);
