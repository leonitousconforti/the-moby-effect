import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmUpdateConfig extends Schema.Class<SwarmUpdateConfig>("SwarmUpdateConfig")(
    {
        Parallelism: EffectSchemas.Number.U64,
        Delay: Schema.optional(EffectSchemas.Number.I64),
        FailureAction: Schema.optional(Schema.String),
        Monitor: Schema.optional(EffectSchemas.Number.I64),
        MaxFailureRatio: Schema.Number,
        Order: Schema.String,
    },
    {
        identifier: "SwarmUpdateConfig",
        title: "swarm.UpdateConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#UpdateConfig",
    }
) {}
