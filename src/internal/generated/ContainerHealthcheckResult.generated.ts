import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerHealthcheckResult extends Schema.Class<ContainerHealthcheckResult>("ContainerHealthcheckResult")(
    {
        Start: Schema.NullOr(Schema.DateFromString),
        End: Schema.NullOr(Schema.DateFromString),
        ExitCode: MobySchemas.Int64,
        Output: Schema.String,
    },
    {
        identifier: "ContainerHealthcheckResult",
        title: "container.HealthcheckResult",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HealthcheckResult",
    }
) {}
