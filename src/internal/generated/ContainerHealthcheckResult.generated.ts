import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerHealthcheckResult extends Schema.Class<ContainerHealthcheckResult>("ContainerHealthcheckResult")(
    {
        Start: Schema.NullOr(Schema.DateFromString),
        End: Schema.NullOr(Schema.DateFromString),
        ExitCode: EffectSchemas.Number.I64,
        Output: Schema.String,
    },
    {
        identifier: "ContainerHealthcheckResult",
        title: "container.HealthcheckResult",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HealthcheckResult",
    }
) {}
