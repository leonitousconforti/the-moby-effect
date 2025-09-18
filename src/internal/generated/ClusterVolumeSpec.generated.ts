import * as Schema from "effect/Schema";
import * as VolumeAccessMode from "./VolumeAccessMode.generated.js";
import * as VolumeCapacityRange from "./VolumeCapacityRange.generated.js";
import * as VolumeSecret from "./VolumeSecret.generated.js";
import * as VolumeTopologyRequirement from "./VolumeTopologyRequirement.generated.js";

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>("ClusterVolumeSpec")(
    {
        Group: Schema.optional(Schema.String),
        AccessMode: Schema.optionalWith(VolumeAccessMode.VolumeAccessMode, { nullable: true }),
        AccessibilityRequirements: Schema.optionalWith(VolumeTopologyRequirement.VolumeTopologyRequirement, {
            nullable: true,
        }),
        CapacityRange: Schema.optionalWith(VolumeCapacityRange.VolumeCapacityRange, { nullable: true }),
        Secrets: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumeSecret.VolumeSecret)), { nullable: true }),
        Availability: Schema.optional(Schema.Literal("active", "pause", "drain")),
    },
    {
        identifier: "ClusterVolumeSpec",
        title: "volume.ClusterVolumeSpec",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#ClusterVolumeSpec",
    }
) {}
