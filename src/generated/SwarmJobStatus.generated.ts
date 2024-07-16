import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmJobStatus extends Schema.Class<SwarmJobStatus>("SwarmJobStatus")(
    {
        JobIteration: MobySchemasGenerated.SwarmVersion,
        LastExecution: Schema.optional(MobySchemasGenerated.Time),
    },
    {
        identifier: "SwarmJobStatus",
        title: "swarm.JobStatus",
    }
) {}
