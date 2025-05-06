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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/blkiodev/blkio.go#L5-L9",
    }
) {}
