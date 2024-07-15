import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class JobStatus extends Schema.Class<JobStatus>("JobStatus")(
    {
        JobIteration: MobySchemasGenerated.Version,
        LastExecution: Schema.optional(MobySchemasGenerated.Time),
    },
    {
        identifier: "JobStatus",
        title: "swarm.JobStatus",
    }
) {}
