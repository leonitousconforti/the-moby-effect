import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumeCapacityRange extends Schema.Class<VolumeCapacityRange>("VolumeCapacityRange")(
    {
        /**
         * RequiredBytes specifies that a volume must be at least this big. The
         * value of 0 indicates an unspecified minimum.
         */
        RequiredBytes: MobySchemas.Int64,

        /**
         * LimitBytes specifies that a volume must not be bigger than this. The
         * value of 0 indicates an unspecified maximum
         */
        LimitBytes: MobySchemas.Int64,
    },
    {
        identifier: "VolumeCapacityRange",
        title: "volume.CapacityRange",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L337-L347",
    }
) {}
