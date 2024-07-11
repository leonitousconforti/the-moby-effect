import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerState extends Schema.Class<ContainerState>("ContainerState")({
    Status: Schema.String,
    Running: Schema.Boolean,
    Paused: Schema.Boolean,
    Restarting: Schema.Boolean,
    OOMKilled: Schema.Boolean,
    Dead: Schema.Boolean,
    Pid: MobySchemas.Int64,
    ExitCode: MobySchemas.Int64,
    Error: Schema.String,
    StartedAt: Schema.String,
    FinishedAt: Schema.String,
    Health: MobySchemas.Health,
}) {}
