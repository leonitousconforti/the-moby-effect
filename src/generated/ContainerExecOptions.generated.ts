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
    }
) {}
