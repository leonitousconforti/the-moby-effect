import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class WeightDevice extends Schema.Class<WeightDevice>("WeightDevice")(
    {
        Path: Schema.String,
        Weight: MobySchemas.UInt16,
    },
    {
        identifier: "WeightDevice",
        title: "blkiodev.WeightDevice",
    }
) {}
