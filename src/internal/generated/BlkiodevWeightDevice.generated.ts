import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class BlkiodevWeightDevice extends Schema.Class<BlkiodevWeightDevice>("BlkiodevWeightDevice")(
    {
        Path: Schema.String,
        Weight: MobyNumber.NumberFromWireString.check(
            Schema.isInt(),
            Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 })
        ),
    },
    {
        identifier: "BlkiodevWeightDevice",
        title: "blkiodev.WeightDevice",
        documentation: "",
    }
) {}
