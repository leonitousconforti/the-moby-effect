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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HealthcheckResult",
    }
) {}
