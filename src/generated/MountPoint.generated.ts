import * as Schema from "@effect/schema/Schema";

export class MountPoint extends Schema.Class<MountPoint>("MountPoint")(
    {
        Type: Schema.optional(Schema.String, { nullable: true }),
        Name: Schema.optional(Schema.String, { nullable: true }),
        Source: Schema.NullOr(Schema.String),
        Destination: Schema.NullOr(Schema.String),
        Driver: Schema.optional(Schema.String, { nullable: true }),
        Mode: Schema.NullOr(Schema.String),
        RW: Schema.NullOr(Schema.Boolean),
        Propagation: Schema.NullOr(Schema.String),
    },
    {
        identifier: "MountPoint",
        title: "types.MountPoint",
    }
) {}
