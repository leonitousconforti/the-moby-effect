import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmOrchestrationConfig extends Schema.Class<SwarmOrchestrationConfig>("SwarmOrchestrationConfig")(
    {
        TaskHistoryRetentionLimit: Schema.optionalWith(EffectSchemas.Number.I64, { nullable: true }),
    },
    {
        identifier: "SwarmOrchestrationConfig",
        title: "swarm.OrchestrationConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#OrchestrationConfig",
    }
) {}
