import * as Schema from "effect/Schema";

export class ContainerMountPoint extends Schema.Class<ContainerMountPoint>("ContainerMountPoint")(
    {
        Type: Schema.optional(Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster", "image")),
        Name: Schema.optional(Schema.String),
        Source: Schema.String,
        Destination: Schema.String,
        Driver: Schema.optional(Schema.String),
        Mode: Schema.String,
        RW: Schema.Boolean,
        Propagation: Schema.Literal("rprivate", "private", "rshared", "shared", "rslave", "slave"),
    },
    {
        identifier: "ContainerMountPoint",
        title: "container.MountPoint",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#MountPoint",
    }
) {}
