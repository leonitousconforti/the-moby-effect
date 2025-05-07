import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BuildCache extends Schema.Class<BuildCache>("BuildCache")(
    {
        /** ID is the unique ID of the build cache record. */
        ID: Schema.String,

        /**
         * Parent is the ID of the parent build cache record. Deprecated:
         * deprecated in API v1.42 and up, as it was deprecated in BuildKit; use
         * Parents instead.
         */
        Parent: Schema.optional(Schema.String),

        /** Parents is the list of parent build cache record IDs. */
        " Parents": Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** Type is the cache record type. */
        Type: Schema.String,

        /**
         * Description is a description of the build-step that produced the
         * build cache.
         */
        Description: Schema.String,

        /** InUse indicates if the build cache is in use. */
        InUse: Schema.Boolean,

        /** Shared indicates if the build cache is shared. */
        Shared: Schema.Boolean,

        /** Size is the amount of disk space used by the build cache (in bytes). */
        Size: MobySchemas.Int64,

        /** CreatedAt is the date and time at which the build cache was created. */
        CreatedAt: Schema.NullOr(Schema.DateFromString),

        /**
         * LastUsedAt is the date and time at which the build cache was last
         * used.
         */
        LastUsedAt: Schema.NullOr(Schema.DateFromString),

        UsageCount: MobySchemas.Int64,
    },
    {
        identifier: "BuildCache",
        title: "types.BuildCache",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/types.go#L143-L168",
    }
) {}
