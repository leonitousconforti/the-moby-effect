import * as Schema from "effect/Schema";
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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L200-L205",
    }
) {}
