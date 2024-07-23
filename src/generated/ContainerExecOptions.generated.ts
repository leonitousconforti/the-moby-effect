import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecOptions extends Schema.Class<ContainerExecOptions>("ContainerExecOptions")(
    {
        User: Schema.String,
        Privileged: Schema.Boolean,
        Tty: Schema.Boolean,
        ConsoleSize: Schema.optional(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), { nullable: true }),
        AttachStdin: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        Detach: Schema.Boolean,
        DetachKeys: Schema.String,
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        WorkingDir: Schema.String,
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerExecOptions",
        title: "container.ExecOptions",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/exec.go#L3-L18",
    }
) {}
