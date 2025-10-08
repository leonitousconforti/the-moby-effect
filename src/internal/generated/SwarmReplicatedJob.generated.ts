import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmReplicatedJob extends Schema.Class<SwarmReplicatedJob>("SwarmReplicatedJob")(
    {
        MaxConcurrent: Schema.optionalWith(EffectSchemas.Number.U64, { nullable: true }),
        TotalCompletions: Schema.optionalWith(EffectSchemas.Number.U64, { nullable: true }),
    },
    {
        identifier: "SwarmReplicatedJob",
        title: "swarm.ReplicatedJob",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ReplicatedJob",
    }
) {}
