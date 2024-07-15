import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class TaskListOptions extends Schema.Class<TaskListOptions>("TaskListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "TaskListOptions",
        title: "types.TaskListOptions",
    }
) {}
