import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class CapacityRange extends Schema.Class<CapacityRange>("CapacityRange")(
    {
        /**
         * Specifies that a volume must be at least this big. The value of 0
         * indicates an unspecified minimum.
         */
        RequiredBytes: MobySchemas.Int64,

        /**
         * Specifies that a volume must not be bigger than this. The value of 0
         * indicates an unspecified maximum
         */
        LimitBytes: MobySchemas.Int64,
    },
    {
        identifier: "CapacityRange",
        title: "volume.CapacityRange",
    }
) {}
