import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ThrottlingData extends Schema.Class<ThrottlingData>("ThrottlingData")({
    Periods: MobySchemas.UInt64,
    ThrottledPeriods: MobySchemas.UInt64,
    ThrottledTime: MobySchemas.UInt64,
}) {}
