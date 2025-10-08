import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as ContainerHealthcheckResult from "./ContainerHealthcheckResult.generated.js";

export class ContainerHealth extends Schema.Class<ContainerHealth>("ContainerHealth")(
    {
        Status: Schema.Literal("none", "starting", "healthy", "unhealthy"),
        FailingStreak: EffectSchemas.Number.I64,
        Log: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerHealthcheckResult.ContainerHealthcheckResult))),
    },
    {
        identifier: "ContainerHealth",
        title: "container.Health",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Health",
    }
) {}
