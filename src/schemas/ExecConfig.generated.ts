import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ExecConfig extends Schema.Class<ExecConfig>("ExecConfig")({
    User: Schema.String,
    Privileged: Schema.Boolean,
    Tty: Schema.Boolean,
    ConsoleSize: Schema.Array(MobySchemas.UInt64),
    AttachStdin: Schema.Boolean,
    AttachStderr: Schema.Boolean,
    AttachStdout: Schema.Boolean,
    Detach: Schema.Boolean,
    DetachKeys: Schema.String,
    Env: Schema.Array(Schema.String),
    WorkingDir: Schema.String,
    Cmd: Schema.Array(Schema.String),
}) {}
