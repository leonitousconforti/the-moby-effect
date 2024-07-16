import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmDispatcherConfig extends Schema.Class<SwarmDispatcherConfig>("SwarmDispatcherConfig")(
    {
        HeartbeatPeriod: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmDispatcherConfig",
        title: "swarm.DispatcherConfig",
    }
) {}
