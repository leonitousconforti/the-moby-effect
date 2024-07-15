import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class UsageData extends Schema.Class<UsageData>("UsageData")(
    {
        /** The number of containers referencing this volume. */
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
        identifier: "UsageData",
        title: "volume.UsageData",
    }
) {}
