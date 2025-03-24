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
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/volume.go#L56-L75",
    }
) {}
