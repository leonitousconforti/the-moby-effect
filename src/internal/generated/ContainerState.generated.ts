import * as Schema from "effect/Schema";
import * as ContainerHealth from "./ContainerHealth.generated.ts";

export class ContainerState extends Schema.Class<ContainerState>("ContainerState")(
    {
        Status: Schema.Literals(["created", "restarting", "running", "removing", "paused", "exited", "dead"]),
        Running: Schema.Boolean,
        Paused: Schema.Boolean,
        Restarting: Schema.Boolean,
        OOMKilled: Schema.Boolean,
        Dead: Schema.Boolean,
        Pid: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        ExitCode: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Error: Schema.String,
        StartedAt: Schema.String,
        FinishedAt: Schema.String,
        Health: Schema.optional(Schema.NullOr(ContainerHealth.ContainerHealth)),
    },
    {
        identifier: "ContainerState",
        title: "container.State",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#State",
    }
) {}
