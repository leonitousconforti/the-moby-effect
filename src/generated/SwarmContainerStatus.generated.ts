import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmContainerStatus extends Schema.Class<SwarmContainerStatus>("SwarmContainerStatus")(
    {
        ContainerID: Schema.String,
        PID: MobySchemas.Int64,
        ExitCode: MobySchemas.Int64,
    },
    {
        identifier: "SwarmContainerStatus",
        title: "swarm.ContainerStatus",
    }
) {}
