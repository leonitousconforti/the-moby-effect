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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/exec.go#L36-L43",
    }
) {}
