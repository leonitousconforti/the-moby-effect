import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>("ClusterVolumeSpec")(
    {
        Group: Schema.optional(Schema.String),
        AccessMode: Schema.optional(MobySchemasGenerated.VolumeAccessMode, { nullable: true }),
        AccessibilityRequirements: Schema.optional(MobySchemasGenerated.VolumeTopologyRequirement, { nullable: true }),
        CapacityRange: Schema.optional(MobySchemasGenerated.VolumeCapacityRange, { nullable: true }),
        Secrets: Schema.optional(Schema.Array(MobySchemasGenerated.VolumeSecret), { nullable: true }),
        Availability: Schema.optional(Schema.String),
    },
    {
        identifier: "ClusterVolumeSpec",
        title: "volume.ClusterVolumeSpec",
    }
) {}
