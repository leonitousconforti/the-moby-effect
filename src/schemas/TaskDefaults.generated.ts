import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TaskDefaults extends Schema.Class<TaskDefaults>("TaskDefaults")({
    LogDriver: MobySchemas.Driver,
}) {}
