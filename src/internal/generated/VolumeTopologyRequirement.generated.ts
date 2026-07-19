import * as Schema from "effect/Schema";
import * as VolumeTopology from "./VolumeTopology.generated.ts";

export class VolumeTopologyRequirement extends Schema.Class<VolumeTopologyRequirement>("VolumeTopologyRequirement")(
    {
        Requisite: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(VolumeTopology.VolumeTopology)))),
        Preferred: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(VolumeTopology.VolumeTopology)))),
    },
    {
        identifier: "VolumeTopologyRequirement",
        title: "volume.TopologyRequirement",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#TopologyRequirement",
    }
) {}
