import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ServiceStatus extends Schema.Class<ServiceStatus>("ServiceStatus")({
    RunningTasks: MobySchemas.UInt64,
    DesiredTasks: MobySchemas.UInt64,
    CompletedTasks: MobySchemas.UInt64,
}) {}
