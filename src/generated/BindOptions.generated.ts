import * as Schema from "@effect/schema/Schema";

export class BindOptions extends Schema.Class<BindOptions>("BindOptions")(
    {
        // https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/mount/mount.go#L44-L57
        Propagation: Schema.optional(Schema.Literal("rprivate", "private", "rshared", "shared", "rslave", "slave")),

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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/mount/mount.go#L84-L93",
    }
) {}
