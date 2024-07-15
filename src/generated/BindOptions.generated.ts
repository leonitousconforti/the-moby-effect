import * as Schema from "@effect/schema/Schema";

export class BindOptions extends Schema.Class<BindOptions>("BindOptions")(
    {
        Propagation: Schema.optional(Schema.String, { nullable: true }),
        NonRecursive: Schema.optional(Schema.Boolean, { nullable: true }),
        CreateMountpoint: Schema.optional(Schema.Boolean, { nullable: true }),
    },
    {
        identifier: "BindOptions",
        title: "mount.BindOptions",
    }
) {}
