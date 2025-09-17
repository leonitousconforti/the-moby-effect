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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ContainerStatus",
    }
) {}
