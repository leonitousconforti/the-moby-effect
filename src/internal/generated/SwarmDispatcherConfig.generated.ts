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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DispatcherConfig",
    }
) {}
