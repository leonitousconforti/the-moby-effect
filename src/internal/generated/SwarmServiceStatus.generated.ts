import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmServiceStatus extends Schema.Class<SwarmServiceStatus>("SwarmServiceStatus")(
    {
        RunningTasks: MobySchemas.UInt64,
        DesiredTasks: MobySchemas.UInt64,
        CompletedTasks: MobySchemas.UInt64,
    },
    {
        identifier: "SwarmServiceStatus",
        title: "swarm.ServiceStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ServiceStatus",
    }
) {}
