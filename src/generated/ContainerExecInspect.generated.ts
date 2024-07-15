import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecInspect extends Schema.Class<ContainerExecInspect>("ContainerExecInspect")(
    {
        ID: Schema.NullOr(Schema.String),
        ContainerID: Schema.NullOr(Schema.String),
        Running: Schema.NullOr(Schema.Boolean),
        ExitCode: Schema.NullOr(MobySchemas.Int64),
        Pid: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "ContainerExecInspect",
        title: "types.ContainerExecInspect",
    }
) {}
