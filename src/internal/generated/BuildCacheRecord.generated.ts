import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class BuildCacheRecord extends Schema.Class<BuildCacheRecord>("BuildCacheRecord")(
    {
        ID: Schema.String,
        Parent: Schema.optional(Schema.String),
        " Parents": Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Type: Schema.String,
        Description: Schema.String,
        InUse: Schema.Boolean,
        Shared: Schema.Boolean,
        Size: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        CreatedAt: Schema.NullOr(Schema.DateFromString),
        LastUsedAt: Schema.NullOr(Schema.DateFromString),
        UsageCount: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "BuildCacheRecord",
        title: "build.CacheRecord",
        documentation: "",
    }
) {}
