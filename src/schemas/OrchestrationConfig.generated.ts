import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class OrchestrationConfig extends Schema.Class<OrchestrationConfig>("OrchestrationConfig")({
    TaskHistoryRetentionLimit: MobySchemas.Int64,
}) {}
