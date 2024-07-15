import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ThrottlingData extends Schema.Class<ThrottlingData>("ThrottlingData")(
    {
        periods: Schema.NullOr(MobySchemas.UInt64),
        throttled_periods: Schema.NullOr(MobySchemas.UInt64),
        throttled_time: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "ThrottlingData",
        title: "types.ThrottlingData",
    }
) {}
