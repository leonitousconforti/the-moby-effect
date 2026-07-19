import * as Schema from "effect/Schema";
import * as VolumeAccessMode from "./VolumeAccessMode.generated.ts";
import * as VolumeCapacityRange from "./VolumeCapacityRange.generated.ts";
import * as VolumeSecret from "./VolumeSecret.generated.ts";
import * as VolumeTopologyRequirement from "./VolumeTopologyRequirement.generated.ts";

export class VolumeClusterVolumeSpec extends Schema.Class<VolumeClusterVolumeSpec>("VolumeClusterVolumeSpec")(
    {
        Group: Schema.optional(Schema.String),
        AccessMode: Schema.optional(Schema.NullOr(VolumeAccessMode.VolumeAccessMode)),
        AccessibilityRequirements: Schema.optional(Schema.NullOr(VolumeTopologyRequirement.VolumeTopologyRequirement)),
        CapacityRange: Schema.optional(Schema.NullOr(VolumeCapacityRange.VolumeCapacityRange)),
        Secrets: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(VolumeSecret.VolumeSecret)))),
        Availability: Schema.optional(Schema.Literals(["active", "pause", "drain"])),
    },
    {
        identifier: "VolumeClusterVolumeSpec",
        title: "volume.ClusterVolumeSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#ClusterVolumeSpec",
    }
) {}
