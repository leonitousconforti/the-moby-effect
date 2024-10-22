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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L165-L184",
    }
) {}
