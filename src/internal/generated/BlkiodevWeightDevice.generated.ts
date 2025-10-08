import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class BlkiodevWeightDevice extends Schema.Class<BlkiodevWeightDevice>("BlkiodevWeightDevice")(
    {
        Path: Schema.String,
        Weight: EffectSchemas.Number.U16,
    },
    {
        identifier: "BlkiodevWeightDevice",
        title: "blkiodev.WeightDevice",
        documentation: "",
    }
) {}
