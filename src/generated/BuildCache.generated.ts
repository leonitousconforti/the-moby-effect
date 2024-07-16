import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class BuildCache extends Schema.Class<BuildCache>("BuildCache")(
    {
        ID: Schema.String,
        Parent: Schema.optional(Schema.String),
        " Parents": Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Type: Schema.String,
        Description: Schema.String,
        InUse: Schema.Boolean,
        Shared: Schema.Boolean,
        Size: MobySchemas.Int64,
        CreatedAt: MobySchemasGenerated.Time,
        LastUsedAt: Schema.NullOr(MobySchemasGenerated.Time),
        UsageCount: MobySchemas.Int64,
    },
    {
        identifier: "BuildCache",
        title: "types.BuildCache",
    }
) {}
