import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";

export class ContainerExecInspect extends Schema.Class<ContainerExecInspect>("ContainerExecInspect")(
    {
        ID: MobyIdentifiers.ExecIdentifier,
        ContainerID: MobyIdentifiers.ContainerIdentifier,
        Running: Schema.Boolean,
        ExitCode: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Pid: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "ContainerExecInspect",
        title: "container.ExecInspect",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecInspect",
    }
) {}
