import * as Schema from "@effect/schema/Schema";

export class BindOptions extends Schema.Class<BindOptions>("BindOptions")(
    {
        Propagation: Schema.optional(Schema.String),
        NonRecursive: Schema.optional(Schema.Boolean),
        CreateMountpoint: Schema.optional(Schema.Boolean),
    },
    {
        identifier: "BindOptions",
        title: "mount.BindOptions",
    }
) {}
