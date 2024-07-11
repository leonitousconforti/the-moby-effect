import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Health extends Schema.Class<Health>("Health")({
    Status: Schema.String,
    FailingStreak: MobySchemas.Int64,
    Log: Schema.Array(MobySchemas.HealthcheckResult),
}) {}
