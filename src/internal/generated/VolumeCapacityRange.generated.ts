import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumeCapacityRange extends Schema.Class<VolumeCapacityRange>("VolumeCapacityRange")(
    {
        RequiredBytes: MobySchemas.Int64,
        LimitBytes: MobySchemas.Int64,
    },
    {
        identifier: "VolumeCapacityRange",
        title: "volume.CapacityRange",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#CapacityRange",
    }
) {}
