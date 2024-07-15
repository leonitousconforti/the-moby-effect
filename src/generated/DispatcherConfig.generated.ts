import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class DispatcherConfig extends Schema.Class<DispatcherConfig>("DispatcherConfig")(
    {
        HeartbeatPeriod: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "DispatcherConfig",
        title: "swarm.DispatcherConfig",
    }
) {}
