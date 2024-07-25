import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTaskStatus extends Schema.Class<SwarmTaskStatus>("SwarmTaskStatus")(
    {
        Timestamp: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        State: Schema.optional(Schema.String),
        Message: Schema.optional(Schema.String),
        Err: Schema.optional(Schema.String),
        ContainerStatus: Schema.optionalWith(MobySchemasGenerated.SwarmContainerStatus, { nullable: true }),
        PortStatus: Schema.optionalWith(MobySchemasGenerated.SwarmPortStatus, { nullable: true }),
    },
    {
        identifier: "SwarmTaskStatus",
        title: "swarm.TaskStatus",
    }
) {}
