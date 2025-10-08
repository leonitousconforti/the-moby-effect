import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmServiceStatus extends Schema.Class<SwarmServiceStatus>("SwarmServiceStatus")(
    {
        RunningTasks: EffectSchemas.Number.U64,
        DesiredTasks: EffectSchemas.Number.U64,
        CompletedTasks: EffectSchemas.Number.U64,
    },
    {
        identifier: "SwarmServiceStatus",
        title: "swarm.ServiceStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ServiceStatus",
    }
) {}
