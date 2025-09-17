import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class WeightDevice extends Schema.Class<WeightDevice>("WeightDevice")(
    {
        Path: Schema.String,
        Weight: MobySchemas.UInt16,
    },
    {
        identifier: "WeightDevice",
        title: "blkiodev.WeightDevice",
        documentation: "",
    }
) {}
