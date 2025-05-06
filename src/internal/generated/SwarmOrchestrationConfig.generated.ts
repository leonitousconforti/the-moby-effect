import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmOrchestrationConfig extends Schema.Class<SwarmOrchestrationConfig>("SwarmOrchestrationConfig")(
    {
        /**
         * TaskHistoryRetentionLimit is the number of historic tasks to keep per
         * instance or node. If negative, never remove completed or failed
         * tasks.
         */
        TaskHistoryRetentionLimit: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "SwarmOrchestrationConfig",
        title: "swarm.OrchestrationConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L46-L51",
    }
) {}
