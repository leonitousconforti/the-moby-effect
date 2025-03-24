/**
 * Compressing utilities for demuxing.
 *
 * @since 1.0.0
 */

import * as Predicate from "effect/Predicate";

import type { Demux } from "./demux.js";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SocketOptions extends Demux.HeterogeneousStdioRawInput<any, any, any, any, any, any, any, any, any>,
    A1,
    A2,
> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SocketOptions["stdout"] extends Demux.AnyRawInput<any, any, any>
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          SocketOptions["stderr"] extends Demux.AnyRawInput<any, any, any>
            ? CompressedDemuxOutput<A1, A2>
            : CompressedDemuxOutput<A1, void>
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          SocketOptions["stderr"] extends Demux.AnyRawInput<any, any, any>
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
