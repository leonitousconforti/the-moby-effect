import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmLimit extends Schema.Class<SwarmLimit>("SwarmLimit")(
    {
        NanoCPUs: Schema.optional(EffectSchemas.Number.I64),
        MemoryBytes: Schema.optional(EffectSchemas.Number.I64),
        Pids: Schema.optional(EffectSchemas.Number.I64),
    },
    {
        identifier: "SwarmLimit",
        title: "swarm.Limit",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Limit",
    }
) {}
