import * as Predicate from "effect/Predicate";

import type * as MobyDemux from "../../MobyDemux.js";

/** @internal */
export const compressDemuxOutput = <A1, A2>(
    data: readonly [ranStdout: A1, ranStderr: A2]
): MobyDemux.CompressedDemuxOutput<A1, A2> =>
    Predicate.isUndefined(data[0]) && Predicate.isUndefined(data[1])
        ? // The demux/platform layers bridge untyped socket and dispatcher APIs; the shape is guaranteed by construction, not by the compiler.
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          (undefined as MobyDemux.CompressedDemuxOutput<A1, A2>)
        : // The demux/platform layers bridge untyped socket and dispatcher APIs; the shape is guaranteed by construction, not by the compiler.
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          (data as MobyDemux.CompressedDemuxOutput<A1, A2>);
