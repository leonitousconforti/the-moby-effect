import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerExecInspect extends Schema.Class<ContainerExecInspect>("ContainerExecInspect")({
    ExecID: Schema.String,
    ContainerID: Schema.String,
    Running: Schema.Boolean,
    ExitCode: MobySchemas.Int64,
    Pid: MobySchemas.Int64,
}) {}
