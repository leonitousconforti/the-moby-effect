import * as Schema from "effect/Schema";

export class MountBindOptions extends Schema.Class<MountBindOptions>("MountBindOptions")(
    {
        Propagation: Schema.optional(Schema.Literal("rprivate", "private", "rshared", "shared", "rslave", "slave")),
        NonRecursive: Schema.optional(Schema.Boolean),
        CreateMountpoint: Schema.optional(Schema.Boolean),
        ReadOnlyNonRecursive: Schema.optional(Schema.Boolean),
        ReadOnlyForceRecursive: Schema.optional(Schema.Boolean),
    },
    {
        identifier: "MountBindOptions",
        title: "mount.BindOptions",
        documentation: "",
    }
) {}
