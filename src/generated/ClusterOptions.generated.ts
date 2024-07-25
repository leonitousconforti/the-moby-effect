import * as Schema from "@effect/schema/Schema";

// Intentionally empty
export class ClusterOptions extends Schema.Class<ClusterOptions>("ClusterOptions")(
    {},
    {
        identifier: "ClusterOptions",
        title: "mount.ClusterOptions",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/mount/mount.go#L147-L150",
    }
) {}
