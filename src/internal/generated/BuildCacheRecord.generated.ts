import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BuildCacheRecord extends Schema.Class<BuildCacheRecord>("BuildCacheRecord")(
    {
        ID: Schema.String,
        Parent: Schema.optional(Schema.String),
        " Parents": Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Type: Schema.String,
        Description: Schema.String,
        InUse: Schema.Boolean,
        Shared: Schema.Boolean,
        Size: MobySchemas.Int64,
        CreatedAt: Schema.NullOr(Schema.DateFromString),
        LastUsedAt: Schema.NullOr(Schema.DateFromString),
        UsageCount: MobySchemas.Int64,
    },
    {
        identifier: "BuildCacheRecord",
        title: "build.CacheRecord",
        documentation: "",
    }
) {}
