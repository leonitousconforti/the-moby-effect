import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmReplicatedJob extends Schema.Class<SwarmReplicatedJob>("SwarmReplicatedJob")(
    {
        /**
         * MaxConcurrent indicates the maximum number of Tasks that should be
         * executing simultaneously for this job at any given time. There may be
         * fewer Tasks that MaxConcurrent executing simultaneously; for example,
         * if there are fewer than MaxConcurrent tasks needed to reach
         * TotalCompletions.
         *
         * If this field is empty, it will default to a max concurrency of 1.
         */
        MaxConcurrent: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),

        /**
         * TotalCompletions is the total number of Tasks desired to run to
         * completion.
         *
         * If this field is empty, the value of MaxConcurrent will be used.
         */
        TotalCompletions: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "SwarmReplicatedJob",
        title: "swarm.ReplicatedJob",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L86-L103",
    }
) {}
