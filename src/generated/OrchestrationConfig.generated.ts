import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class OrchestrationConfig extends Schema.Class<OrchestrationConfig>("OrchestrationConfig")(
    {
        TaskHistoryRetentionLimit: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "OrchestrationConfig",
        title: "swarm.OrchestrationConfig",
    }
) {}
