import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerStatus extends Schema.Class<ContainerStatus>("ContainerStatus")(
    {
        ContainerID: Schema.NullOr(Schema.String),
        PID: Schema.NullOr(MobySchemas.Int64),
        ExitCode: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "ContainerStatus",
        title: "swarm.ContainerStatus",
    }
) {}
