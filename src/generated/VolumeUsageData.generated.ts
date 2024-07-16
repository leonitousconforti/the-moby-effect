import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumeUsageData extends Schema.Class<VolumeUsageData>("VolumeUsageData")(
    {
        RefCount: MobySchemas.Int64,
        Size: MobySchemas.Int64,
    },
    {
        identifier: "VolumeUsageData",
        title: "volume.UsageData",
    }
) {}
