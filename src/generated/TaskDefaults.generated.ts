import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class TaskDefaults extends Schema.Class<TaskDefaults>("TaskDefaults")(
    {
        LogDriver: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
    },
    {
        identifier: "TaskDefaults",
        title: "swarm.TaskDefaults",
    }
) {}
