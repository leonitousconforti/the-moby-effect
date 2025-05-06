import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumeUsageData extends Schema.Class<VolumeUsageData>("VolumeUsageData")(
    {
        /**
         * The number of containers referencing this volume. This field is set
         * to `-1` if the reference-count is not available.
         */
        RefCount: MobySchemas.Int64,

        /**
         * Amount of disk space used by the volume (in bytes). This information
         * is only available for volumes created with the `"local"` volume
         * driver. For volumes created with other volume drivers, this field is
         * set to `-1` ("not available")
         */
        Size: MobySchemas.Int64,
    },
    {
        identifier: "VolumeUsageData",
        title: "volume.UsageData",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/volume.go#L56-L75",
    }
) {}
