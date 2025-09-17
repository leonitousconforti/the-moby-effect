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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecInspect",
    }
) {}
