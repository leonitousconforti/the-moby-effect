import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** BuildCache contains information about a build cache record. */
export const BuildCache = S.Struct({
    /** Unique ID of the build cache record. */
    ID: S.optional(S.String),
    /**
     * ID of the parent build cache record.> **Deprecated**: This field is
     * deprecated, and omitted if empty.
     */
    Parent: S.optional(S.String),
    /** List of parent build cache record IDs. */
    Parents: S.optional(S.Array(S.String)),
    /** Cache record type. */
    Type: S.optional(
        S.Literal("internal", "frontend", "source.local", "source.git.checkout", "exec.cachemount", "regular")
    ),
    /** Description of the build-step that produced the build cache. */
    Description: S.optional(S.String),
    /** Indicates if the build cache is in use. */
    InUse: S.optional(S.Boolean),
    /** Indicates if the build cache is shared. */
    Shared: S.optional(S.Boolean),
    /** Amount of disk space used by the build cache (in bytes). */
    Size: S.optional(pipe(S.Number, S.int())),
    /**
     * Date and time at which the build cache was created in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: S.optional(S.String),
    /**
     * Date and time at which the build cache was last used in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    LastUsedAt: S.optional(S.String),
    UsageCount: S.optional(pipe(S.Number, S.int())),
});

export type BuildCache = S.Schema.Type<typeof BuildCache>;
export const BuildCacheEncoded = S.encodedSchema(BuildCache);
export type BuildCacheEncoded = S.Schema.Encoded<typeof BuildCache>;
