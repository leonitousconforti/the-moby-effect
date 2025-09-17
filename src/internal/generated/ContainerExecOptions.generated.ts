import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecOptions extends Schema.Class<ContainerExecOptions>("ContainerExecOptions")(
    {
        User: Schema.String,
        Privileged: Schema.Boolean,
        Tty: Schema.Boolean,
        ConsoleSize: Schema.optionalWith(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), {
            nullable: true,
        }),
        AttachStdin: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        DetachKeys: Schema.String,
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        WorkingDir: Schema.String,
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
        Detach: Schema.Boolean,
    },
    {
        identifier: "ContainerExecOptions",
        title: "container.ExecOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecOptions",
    }
) {}
