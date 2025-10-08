import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class BuildCacheRecord extends Schema.Class<BuildCacheRecord>("BuildCacheRecord")(
    {
        ID: Schema.String,
        Parent: Schema.optional(Schema.String),
        " Parents": Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Type: Schema.String,
        Description: Schema.String,
        InUse: Schema.Boolean,
        Shared: Schema.Boolean,
        Size: EffectSchemas.Number.I64,
        CreatedAt: Schema.NullOr(Schema.DateFromString),
        LastUsedAt: Schema.NullOr(Schema.DateFromString),
        UsageCount: EffectSchemas.Number.I64,
    },
    {
        identifier: "BuildCacheRecord",
        title: "build.CacheRecord",
        documentation: "",
    }
) {}
