import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecOptions extends Schema.Class<ContainerExecOptions>("ContainerExecOptions")(
    {
        User: Schema.optionalWith(Schema.String, { nullable: true }),
        Privileged: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        Tty: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        ConsoleSize: Schema.optionalWith(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), {
            nullable: true,
        }),
        AttachStdin: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        AttachStderr: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        AttachStdout: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        Detach: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        DetachKeys: Schema.optionalWith(Schema.String, { nullable: true }),
        Env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        WorkingDir: Schema.optionalWith(Schema.String, { nullable: true }),
        Cmd: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "ContainerExecOptions",
        title: "container.ExecOptions",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/exec.go#L3-L18",
    }
) {}
