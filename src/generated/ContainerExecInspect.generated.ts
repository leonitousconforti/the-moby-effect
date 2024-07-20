import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecInspect extends Schema.Class<ContainerExecInspect>("ContainerExecInspect")(
    {
        ID: Schema.String,
        ContainerID: Schema.String,
        Running: Schema.Boolean,
        ExitCode: MobySchemas.Int64,
        Pid: MobySchemas.Int64,
    },
    {
        identifier: "ContainerExecInspect",
        title: "container.ExecInspect",
    }
) {}
