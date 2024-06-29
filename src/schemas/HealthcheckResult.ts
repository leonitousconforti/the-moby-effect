import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/**
 * HealthcheckResult stores information about a single run of a healthcheck
 * probe
 */
export const HealthcheckResult = S.Struct({
    /**
     * Date and time at which this check started in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Start: S.optional(S.Date),
    /**
     * Date and time at which this check ended in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    End: S.optional(S.String),
    /**
     * ExitCode meanings:
     *
     * - `0` healthy
     * - `1` unhealthy
     * - `2` reserved (considered unhealthy)
     * - Other values: error running probe
     */
    ExitCode: S.optional(pipe(S.Number, S.int())),
    /** Output from last check */
    Output: S.optional(S.String),
});

export type HealthcheckResult = S.Schema.Type<typeof HealthcheckResult>;
export const HealthcheckResultEncoded = S.encodedSchema(HealthcheckResult);
export type HealthcheckResultEncoded = S.Schema.Encoded<typeof HealthcheckResult>;
