import type * as MobyDemux from "../../MobyDemux.js";

import * as Predicate from "effect/Predicate";

/** @internal */
export const compressDemuxOutput = <A1, A2>(
    data: readonly [ranStdout: A1, ranStderr: A2]
): MobyDemux.CompressedDemuxOutput<A1, A2> =>
    Predicate.isUndefined(data[0]) && Predicate.isUndefined(data[1])
        ? (void undefined as MobyDemux.CompressedDemuxOutput<A1, A2>)
        : (data as MobyDemux.CompressedDemuxOutput<A1, A2>);
