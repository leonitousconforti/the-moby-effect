import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ExecStartOptions extends Schema.Class<ExecStartOptions>("ExecStartOptions")({
    Stdin: object,
    Stdout: object,
    Stderr: object,
    ConsoleSize: Schema.Array(MobySchemas.UInt64),
}) {}
