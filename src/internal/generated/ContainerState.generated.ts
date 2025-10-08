import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as ContainerHealth from "./ContainerHealth.generated.js";

export class ContainerState extends Schema.Class<ContainerState>("ContainerState")(
    {
        Status: Schema.Literal("created", "restarting", "running", "removing", "paused", "exited", "dead"),
        Running: Schema.Boolean,
        Paused: Schema.Boolean,
        Restarting: Schema.Boolean,
        OOMKilled: Schema.Boolean,
        Dead: Schema.Boolean,
        Pid: EffectSchemas.Number.I64,
        ExitCode: EffectSchemas.Number.I64,
        Error: Schema.String,
        StartedAt: Schema.String,
        FinishedAt: Schema.String,
        Health: Schema.optionalWith(ContainerHealth.ContainerHealth, { nullable: true }),
    },
    {
        identifier: "ContainerState",
        title: "container.State",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#State",
    }
) {}
