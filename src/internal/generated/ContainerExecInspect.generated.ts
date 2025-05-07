import * as Schema from "effect/Schema";
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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/exec.go#L44-L51",
    }
) {}
