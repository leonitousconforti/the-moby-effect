import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class TaskStatus extends Schema.Class<TaskStatus>("TaskStatus")(
    {
        Timestamp: Schema.optional(MobySchemasGenerated.Time),
        State: Schema.optional(Schema.String, { nullable: true }),
        Message: Schema.optional(Schema.String, { nullable: true }),
        Err: Schema.optional(Schema.String, { nullable: true }),
        ContainerStatus: Schema.optional(MobySchemasGenerated.ContainerStatus, { nullable: true }),
        PortStatus: Schema.optional(MobySchemasGenerated.PortStatus),
    },
    {
        identifier: "TaskStatus",
        title: "swarm.TaskStatus",
    }
) {}
