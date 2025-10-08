import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerExecInspect extends Schema.Class<ContainerExecInspect>("ContainerExecInspect")(
    {
        ID: Schema.String,
        ContainerID: Schema.String,
        Running: Schema.Boolean,
        ExitCode: EffectSchemas.Number.I64,
        Pid: EffectSchemas.Number.I64,
    },
    {
        identifier: "ContainerExecInspect",
        title: "container.ExecInspect",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecInspect",
    }
) {}
