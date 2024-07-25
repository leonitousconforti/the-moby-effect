import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmReplicatedJob extends Schema.Class<SwarmReplicatedJob>("SwarmReplicatedJob")(
    {
        MaxConcurrent: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        TotalCompletions: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "SwarmReplicatedJob",
        title: "swarm.ReplicatedJob",
    }
) {}
