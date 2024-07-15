import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class BuildCache extends Schema.Class<BuildCache>("BuildCache")(
    {
        ID: Schema.NullOr(Schema.String),
        Parent: Schema.optional(Schema.String, { nullable: true }),
        " Parents": Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Type: Schema.NullOr(Schema.String),
        Description: Schema.NullOr(Schema.String),
        InUse: Schema.NullOr(Schema.Boolean),
        Shared: Schema.NullOr(Schema.Boolean),
        Size: Schema.NullOr(MobySchemas.Int64),
        CreatedAt: MobySchemasGenerated.Time,
        LastUsedAt: Schema.NullOr(MobySchemasGenerated.Time),
        UsageCount: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "BuildCache",
        title: "types.BuildCache",
    }
) {}
