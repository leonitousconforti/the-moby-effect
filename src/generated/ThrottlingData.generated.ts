import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ThrottlingData extends Schema.Class<ThrottlingData>("ThrottlingData")(
    {
        periods: MobySchemas.UInt64,
        throttled_periods: MobySchemas.UInt64,
        throttled_time: MobySchemas.UInt64,
    },
    {
        identifier: "ThrottlingData",
        title: "types.ThrottlingData",
    }
) {}
