import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHealth from "./ContainerHealth.generated.js";

export class ContainerState extends Schema.Class<ContainerState>("ContainerState")(
    {
        Status: Schema.Literal("created", "restarting", "running", "removing", "paused", "exited", "dead"),
        Running: Schema.Boolean,
        Paused: Schema.Boolean,
        Restarting: Schema.Boolean,
        OOMKilled: Schema.Boolean,
        Dead: Schema.Boolean,
        Pid: MobySchemas.Int64,
        ExitCode: MobySchemas.Int64,
        Error: Schema.String,
        StartedAt: Schema.DateFromString,
        FinishedAt: Schema.DateFromString,
        Health: Schema.optionalWith(ContainerHealth.ContainerHealth, { nullable: true }),
    },
    {
        identifier: "ContainerState",
        title: "container.State",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#State",
    }
) {}
