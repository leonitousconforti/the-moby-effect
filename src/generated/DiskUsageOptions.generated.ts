import * as Schema from "@effect/schema/Schema";

export class DiskUsageOptions extends Schema.Class<DiskUsageOptions>("DiskUsageOptions")(
    {
        Types: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "DiskUsageOptions",
        title: "types.DiskUsageOptions",
    }
) {}
