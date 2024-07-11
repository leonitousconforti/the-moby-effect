import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class JobStatus extends Schema.Class<JobStatus>("JobStatus")({
    JobIteration: MobySchemas.Version,
    LastExecution: MobySchemas.Time,
}) {}
