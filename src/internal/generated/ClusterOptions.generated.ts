import * as Schema from "effect/Schema";

// Intentionally empty
export class ClusterOptions extends Schema.Class<ClusterOptions>("ClusterOptions")(
    {},
    {
        identifier: "ClusterOptions",
        title: "mount.ClusterOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L154-L157",
    }
) {}
