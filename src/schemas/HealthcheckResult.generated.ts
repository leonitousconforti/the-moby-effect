import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class HealthcheckResult extends Schema.Class<HealthcheckResult>("HealthcheckResult")({
    Start: MobySchemas.Time,
    End: MobySchemas.Time,
    ExitCode: MobySchemas.Int64,
    Output: Schema.String,
}) {}
