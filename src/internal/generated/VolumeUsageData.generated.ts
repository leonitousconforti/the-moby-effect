import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumeUsageData extends Schema.Class<VolumeUsageData>("VolumeUsageData")(
    {
        RefCount: MobySchemas.Int64,
        Size: MobySchemas.Int64,
    },
    {
        identifier: "VolumeUsageData",
        title: "volume.UsageData",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#UsageData",
    }
) {}
