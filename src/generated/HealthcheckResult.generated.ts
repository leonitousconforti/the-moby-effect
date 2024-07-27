import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Time from "./Time.generated.js";

export class HealthcheckResult extends Schema.Class<HealthcheckResult>("HealthcheckResult")(
    {
        Start: Schema.NullOr(Time.Time),
        End: Schema.NullOr(Time.Time),
        ExitCode: MobySchemas.Int64,
        Output: Schema.String,
    },
    {
        identifier: "HealthcheckResult",
        title: "types.HealthcheckResult",
    }
) {}
