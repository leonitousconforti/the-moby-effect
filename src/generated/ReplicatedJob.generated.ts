import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ReplicatedJob extends Schema.Class<ReplicatedJob>("ReplicatedJob")(
    {
        MaxConcurrent: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        TotalCompletions: Schema.optional(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "ReplicatedJob",
        title: "swarm.ReplicatedJob",
    }
) {}
