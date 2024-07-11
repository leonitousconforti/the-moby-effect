import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TaskStatus extends Schema.Class<TaskStatus>("TaskStatus")({
    Timestamp: MobySchemas.Time,
    State: Schema.String,
    Message: Schema.String,
    Err: Schema.String,
    ContainerStatus: MobySchemas.ContainerStatus,
    PortStatus: MobySchemas.PortStatus,
}) {}
