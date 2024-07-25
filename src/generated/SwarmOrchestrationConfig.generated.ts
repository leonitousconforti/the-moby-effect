import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmOrchestrationConfig extends Schema.Class<SwarmOrchestrationConfig>("SwarmOrchestrationConfig")(
    {
        TaskHistoryRetentionLimit: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "SwarmOrchestrationConfig",
        title: "swarm.OrchestrationConfig",
    }
) {}
