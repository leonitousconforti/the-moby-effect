import * as Schema from "effect/Schema";

export class MountPoint extends Schema.Class<MountPoint>("MountPoint")(
    {
        Type: Schema.optional(
            Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster", "image").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L7-L24",
            })
        ),
        Name: Schema.optional(Schema.String),
        Source: Schema.String,
        Destination: Schema.String,
        Driver: Schema.optional(Schema.String),
        Mode: Schema.String,
        RW: Schema.Boolean,
        Propagation: Schema.Literal("rprivate", "private", "rshared", "shared", "rslave", "slave").annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L44-L60",
        }),
    },
    {
        identifier: "MountPoint",
        title: "container.MountPoint",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/container.go#L60-L102",
    }
) {}
