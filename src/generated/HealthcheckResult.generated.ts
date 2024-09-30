import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class HealthcheckResult extends Schema.Class<HealthcheckResult>("HealthcheckResult")(
    {
        Start: Schema.NullOr(Schema.DateFromString),
        End: Schema.NullOr(Schema.DateFromString),
        ExitCode: MobySchemas.Int64,
        Output: Schema.String,
    },
    {
        identifier: "HealthcheckResult",
        title: "types.HealthcheckResult",
    }
) {}
