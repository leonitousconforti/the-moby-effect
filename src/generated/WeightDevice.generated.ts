import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class WeightDevice extends Schema.Class<WeightDevice>("WeightDevice")(
    {
        Path: Schema.NullOr(Schema.String),
        Weight: Schema.NullOr(MobySchemas.UInt16),
    },
    {
        identifier: "WeightDevice",
        title: "blkiodev.WeightDevice",
    }
) {}
