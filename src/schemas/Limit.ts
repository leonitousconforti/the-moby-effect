import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** An object describing a limit on resources which can be requested by a task. */
export const Limit = S.Struct({
    NanoCPUs: S.optional(pipe(S.Number, S.int())),
    MemoryBytes: S.optional(pipe(S.Number, S.int())),
    /**
     * Limits the maximum number of PIDs in the container. Set `0` for
     * unlimited.
     */
    Pids: S.optional(pipe(S.Number, S.int()), {
        default: () => 0,
    }),
});

export type Limit = S.Schema.Type<typeof Limit>;
export const LimitEncoded = S.encodedSchema(Limit);
export type LimitEncoded = S.Schema.Encoded<typeof Limit>;
