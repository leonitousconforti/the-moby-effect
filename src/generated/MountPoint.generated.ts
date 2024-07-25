import * as Schema from "@effect/schema/Schema";

export class MountPoint extends Schema.Class<MountPoint>("MountPoint")(
    {
        Type: Schema.optional(Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster")),
        Name: Schema.optional(Schema.String),
        Source: Schema.String,
        Destination: Schema.String,
        Driver: Schema.optional(Schema.String),
        Mode: Schema.String,
        RW: Schema.Boolean,
        Propagation: Schema.Literal("rprivate", "private", "rshared", "shared", "rslave", "slave"),
    },
    {
        identifier: "MountPoint",
        title: "types.MountPoint",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/types.go#L334-L376",
    }
) {}
