import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumeCapacityRange extends Schema.Class<VolumeCapacityRange>("VolumeCapacityRange")(
    {
        RequiredBytes: MobySchemas.Int64,
        LimitBytes: MobySchemas.Int64,
    },
    {
        identifier: "VolumeCapacityRange",
        title: "volume.CapacityRange",
    }
) {}
