import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmRestartPolicy extends Schema.Class<SwarmRestartPolicy>("SwarmRestartPolicy")(
    {
        Condition: Schema.optional(Schema.Literal("none", "on-failure", "any")),
        Delay: Schema.optionalWith(EffectSchemas.Number.I64, { nullable: true }),
        MaxAttempts: Schema.optionalWith(EffectSchemas.Number.U64, { nullable: true }),
        Window: Schema.optionalWith(EffectSchemas.Number.I64, { nullable: true }),
    },
    {
        identifier: "SwarmRestartPolicy",
        title: "swarm.RestartPolicy",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#RestartPolicy",
    }
) {}
