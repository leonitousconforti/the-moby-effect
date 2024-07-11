import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TaskListOptions extends Schema.Class<TaskListOptions>("TaskListOptions")({
    Filters: MobySchemas.Args,
}) {}
