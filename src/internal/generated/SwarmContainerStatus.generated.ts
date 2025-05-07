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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L200-L205",
    }
) {}
