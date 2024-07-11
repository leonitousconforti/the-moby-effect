import * as Schema from "@effect/schema/Schema";

export class DiskUsageOptions extends Schema.Class<DiskUsageOptions>("DiskUsageOptions")({
    Types: Schema.Array(Schema.String),
}) {}
