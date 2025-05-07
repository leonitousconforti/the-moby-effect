import * as Schema from "effect/Schema";
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
        title: "container.HealthcheckResult",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/health.go#L25-L31",
    }
) {}
