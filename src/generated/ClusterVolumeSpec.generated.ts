import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>("ClusterVolumeSpec")(
    {
        Group: Schema.optional(Schema.String, { nullable: true }),
        AccessMode: Schema.optional(MobySchemasGenerated.AccessMode, { nullable: true }),
        AccessibilityRequirements: Schema.optional(MobySchemasGenerated.TopologyRequirement, { nullable: true }),
        CapacityRange: Schema.optional(MobySchemasGenerated.CapacityRange, { nullable: true }),
        Secrets: Schema.optional(Schema.Array(MobySchemasGenerated.Secret), { nullable: true }),
        Availability: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "ClusterVolumeSpec",
        title: "volume.ClusterVolumeSpec",
    }
) {}
