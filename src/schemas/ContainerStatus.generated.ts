import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerStatus extends Schema.Class<ContainerStatus>("ContainerStatus")({
    ContainerID: Schema.String,
    PID: MobySchemas.Int64,
    ExitCode: MobySchemas.Int64,
}) {}
