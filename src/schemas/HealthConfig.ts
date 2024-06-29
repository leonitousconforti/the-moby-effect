import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** A test to perform to check that the container is healthy. */
export const HealthConfig = S.Struct({
    /**
     * The test to perform. Possible values are:
     *
     * - `[]` inherit healthcheck from image or parent image
     * - `["NONE"]` disable healthcheck
     * - `["CMD", args...]` exec arguments directly
     * - `["CMD-SHELL", command]` run command with system's default shell
     */
    Test: S.optional(S.Array(S.String)),
    /**
     * The time to wait between checks in nanoseconds. It should be 0 or at
     * least 1000000 (1 ms). 0 means inherit.
     */
    Interval: S.optional(pipe(S.Number, S.int())),
    /**
     * The time to wait before considering the check to have hung. It should be
     * 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    Timeout: S.optional(pipe(S.Number, S.int())),
    /**
     * The number of consecutive failures needed to consider a container as
     * unhealthy. 0 means inherit.
     */
    Retries: S.optional(pipe(S.Number, S.int())),
    /**
     * Start period for the container to initialize before starting
     * health-retries countdown in nanoseconds. It should be 0 or at least
     * 1000000 (1 ms). 0 means inherit.
     */
    StartPeriod: S.optional(pipe(S.Number, S.int())),
    /**
     * The time to wait between checks in nanoseconds during the start period.
     * It should be 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    StartInterval: S.optional(pipe(S.Number, S.int())),
});

export type HealthConfig = S.Schema.Type<typeof HealthConfig>;
export const HealthConfigEncoded = S.encodedSchema(HealthConfig);
export type HealthConfigEncoded = S.Schema.Encoded<typeof HealthConfig>;
