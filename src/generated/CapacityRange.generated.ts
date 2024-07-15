import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class CapacityRange extends Schema.Class<CapacityRange>("CapacityRange")(
    {
        RequiredBytes: Schema.NullOr(MobySchemas.Int64),
        LimitBytes: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "CapacityRange",
        title: "volume.CapacityRange",
    }
) {}
