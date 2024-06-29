import { Schema as S } from "@effect/schema";

/**
 * Commit holds the Git-commit (SHA1) that a binary was built from, as reported
 * in the version-string of external tools, such as `containerd`, or `runC`.
 */
export const Commit = S.Struct({
    /** Actual commit ID of external tool. */
    ID: S.optional(S.String),
    /** Commit ID of external tool expected by dockerd as set at build time. */
    Expected: S.optional(S.String),
});

export type Commit = S.Schema.Type<typeof Commit>;
export const CommitEncoded = S.encodedSchema(Commit);
export type CommitEncoded = S.Schema.Encoded<typeof Commit>;
