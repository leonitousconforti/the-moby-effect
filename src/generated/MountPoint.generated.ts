import * as Schema from "@effect/schema/Schema";

export class MountPoint extends Schema.Class<MountPoint>("MountPoint")(
    {
        Type: Schema.optional(Schema.String),
        Name: Schema.optional(Schema.String),
        Source: Schema.String,
        Destination: Schema.String,
        Driver: Schema.optional(Schema.String),
        Mode: Schema.String,
        RW: Schema.Boolean,
        Propagation: Schema.String,
    },
    {
        identifier: "MountPoint",
        title: "types.MountPoint",
    }
) {}
