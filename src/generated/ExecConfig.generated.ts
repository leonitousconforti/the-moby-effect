import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ExecConfig extends Schema.Class<ExecConfig>("ExecConfig")(
    {
        User: Schema.NullOr(Schema.String),
        Privileged: Schema.NullOr(Schema.Boolean),
        Tty: Schema.NullOr(Schema.Boolean),
        ConsoleSize: Schema.optional(Schema.Array(MobySchemas.UInt64), { nullable: true }),
        AttachStdin: Schema.NullOr(Schema.Boolean),
        AttachStderr: Schema.NullOr(Schema.Boolean),
        AttachStdout: Schema.NullOr(Schema.Boolean),
        Detach: Schema.NullOr(Schema.Boolean),
        DetachKeys: Schema.NullOr(Schema.String),
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        WorkingDir: Schema.NullOr(Schema.String),
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ExecConfig",
        title: "types.ExecConfig",
    }
) {}
