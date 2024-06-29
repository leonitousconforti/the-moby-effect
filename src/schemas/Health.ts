import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { HealthcheckResult } from "./HealthcheckResult.js";

/** Health stores information about the container's healthcheck results. */
export const Health = S.Struct({
    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
     *
     * - "none" Indicates there is no healthcheck
     * - "starting" Starting indicates that the container is not yet ready
     * - "healthy" Healthy indicates that the container is running correctly
     * - "unhealthy" Unhealthy indicates that the container has a problem
     */
    Status: S.optional(S.Literal("none", "starting", "healthy", "unhealthy")),
    /** FailingStreak is the number of consecutive failures */
    FailingStreak: S.optional(pipe(S.Number, S.int())),
    /** Log contains the last few results (oldest first) */
    Log: S.optional(S.Array(HealthcheckResult)),
});

export type Health = S.Schema.Type<typeof Health>;
export const HealthEncoded = S.encodedSchema(Health);
export type HealthEncoded = S.Schema.Encoded<typeof Health>;
