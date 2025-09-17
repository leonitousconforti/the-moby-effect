import * as Schema from "effect/Schema";
import * as VolumeTopology from "./VolumeTopology.generated.js";

export class VolumeTopologyRequirement extends Schema.Class<VolumeTopologyRequirement>("VolumeTopologyRequirement")(
    {
        Requisite: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumeTopology.VolumeTopology)), { nullable: true }),
        Preferred: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumeTopology.VolumeTopology)), { nullable: true }),
    },
    {
        identifier: "VolumeTopologyRequirement",
        title: "volume.TopologyRequirement",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#TopologyRequirement",
    }
) {}
