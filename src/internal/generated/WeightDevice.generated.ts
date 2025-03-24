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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/blkiodev/blkio.go#L5-L9",
    }
) {}
