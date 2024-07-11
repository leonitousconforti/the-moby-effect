import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class HealthConfig extends Schema.Class<HealthConfig>("HealthConfig")({
    Test: Schema.Array(Schema.String),
    Interval: MobySchemas.Int64,
    Timeout: MobySchemas.Int64,
    StartPeriod: MobySchemas.Int64,
    Retries: MobySchemas.Int64,
}) {}
