import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmDispatcherConfig extends Schema.Class<SwarmDispatcherConfig>("SwarmDispatcherConfig")(
    {
        HeartbeatPeriod: Schema.optional(EffectSchemas.Number.I64),
    },
    {
        identifier: "SwarmDispatcherConfig",
        title: "swarm.DispatcherConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DispatcherConfig",
    }
) {}
