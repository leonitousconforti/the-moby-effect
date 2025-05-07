import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmDispatcherConfig extends Schema.Class<SwarmDispatcherConfig>("SwarmDispatcherConfig")(
    {
        HeartbeatPeriod: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmDispatcherConfig",
        title: "swarm.DispatcherConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L102-L107",
    }
) {}
