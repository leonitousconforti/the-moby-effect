import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/**
 * The behavior to apply when the container exits. The default is not to
 * restart.
 *
 * An ever increasing delay (double the previous delay, starting at 100ms) is
 * added before each restart to prevent flooding the server.
 */
export const RestartPolicy = S.Struct({
    /**
     * - Empty string means not to restart
     *
     *   - `no` Do not automatically restart
     *   - `always` Always restart
     *   - `unless-stopped` Restart always except when the user has manually stopped
     *       the container
     *   - `on-failure` Restart only when the container exit code is non-zero
     */
    Name: S.optional(S.Literal("", "no", "always", "unless-stopped", "on-failure")),
    /** If `on-failure` is used, the number of times to retry before giving up. */
    MaximumRetryCount: S.optional(pipe(S.Number, S.int())),
});

export type RestartPolicy = S.Schema.Type<typeof RestartPolicy>;
export const RestartPolicyEncoded = S.encodedSchema(RestartPolicy);
export type RestartPolicyEncoded = S.Schema.Encoded<typeof RestartPolicy>;
