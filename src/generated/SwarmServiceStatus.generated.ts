import * as Schema from "@effect/schema/Schema";
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
    }
) {}
