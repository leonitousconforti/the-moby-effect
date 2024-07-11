import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class BuildCache extends Schema.Class<BuildCache>("BuildCache")({
    ID: Schema.String,
    Parent: Schema.String,
    Parents: Schema.Array(Schema.String),
    Type: Schema.String,
    Description: Schema.String,
    InUse: Schema.Boolean,
    Shared: Schema.Boolean,
    Size: MobySchemas.Int64,
    CreatedAt: MobySchemas.Time,
    LastUsedAt: MobySchemas.Time,
    UsageCount: MobySchemas.Int64,
}) {}
