import * as Schema from "effect/Schema";

export class BindOptions extends Schema.Class<BindOptions>("BindOptions")(
    {
        Propagation: Schema.optional(
            Schema.Literal("rprivate", "private", "rshared", "shared", "rslave", "slave").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L44-L60",
            })
        ),

        NonRecursive: Schema.optional(Schema.Boolean),
        CreateMountpoint: Schema.optional(Schema.Boolean),

        /**
         * ReadOnlyNonRecursive makes the mount non-recursively read-only, but
         * still leaves the mount recursive unless NonRecursive is set to true
         * in conjunction.
         */
        ReadOnlyNonRecursive: Schema.optional(Schema.Boolean),

        /**
         * ReadOnlyForceRecursive raises an error if the mount cannot be made
         * recursively read-only.
         */
        ReadOnlyForceRecursive: Schema.optional(Schema.Boolean),
    },
    {
        identifier: "BindOptions",
        title: "mount.BindOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L86-L96",
    }
) {}
