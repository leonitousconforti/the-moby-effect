import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmReplicatedJob extends Schema.Class<SwarmReplicatedJob>("SwarmReplicatedJob")(
    {
        MaxConcurrent: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        TotalCompletions: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "SwarmReplicatedJob",
        title: "swarm.ReplicatedJob",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ReplicatedJob",
    }
) {}
