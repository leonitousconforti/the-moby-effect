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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L86-L103",
    }
) {}
