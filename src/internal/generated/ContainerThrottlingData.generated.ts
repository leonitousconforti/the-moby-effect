import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerThrottlingData extends Schema.Class<ContainerThrottlingData>("ContainerThrottlingData")(
    {
        periods: EffectSchemas.Number.U64,
        throttled_periods: EffectSchemas.Number.U64,
        throttled_time: EffectSchemas.Number.U64,
    },
    {
        identifier: "ContainerThrottlingData",
        title: "container.ThrottlingData",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ThrottlingData",
    }
) {}
