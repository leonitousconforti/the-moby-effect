import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BlkiodevWeightDevice extends Schema.Class<BlkiodevWeightDevice>("BlkiodevWeightDevice")(
    {
        Path: Schema.String,
        Weight: MobySchemas.UInt16,
    },
    {
        identifier: "BlkiodevWeightDevice",
        title: "blkiodev.WeightDevice",
        documentation: "",
    }
) {}
