import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ExecStartCheck extends Schema.Class<ExecStartCheck>("ExecStartCheck")({
    Detach: Schema.Boolean,
    Tty: Schema.Boolean,
    ConsoleSize: Schema.Array(MobySchemas.UInt64),
}) {}
