import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTaskStatus extends Schema.Class<SwarmTaskStatus>("SwarmTaskStatus")(
    {
        Timestamp: Schema.optional(MobySchemasGenerated.Time),
        State: Schema.optional(Schema.String),
        Message: Schema.optional(Schema.String),
        Err: Schema.optional(Schema.String),
        ContainerStatus: Schema.optional(MobySchemasGenerated.SwarmContainerStatus, { nullable: true }),
        PortStatus: Schema.optional(MobySchemasGenerated.SwarmPortStatus),
    },
    {
        identifier: "SwarmTaskStatus",
        title: "swarm.TaskStatus",
    }
) {}