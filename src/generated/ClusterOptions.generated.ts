import * as Schema from "@effect/schema/Schema";

export class ClusterOptions extends Schema.Class<ClusterOptions>("ClusterOptions")(
    {},
    {
        identifier: "ClusterOptions",
        title: "mount.ClusterOptions",
    }
) {}
