import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecInspectResponse extends Schema.Class<ContainerExecInspectResponse>(
    "ContainerExecInspectResponse"
)(
    {
        ID: Schema.String,
        ContainerID: Schema.String,
        Running: Schema.Boolean,
        ExitCode: MobySchemas.Int64,
        Pid: MobySchemas.Int64,
    },
    {
        identifier: "ContainerExecInspectResponse",
        title: "types.ContainerExecInspect",
    }
) {}
