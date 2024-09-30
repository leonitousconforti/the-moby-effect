import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L337-L347",
    }
) {}
