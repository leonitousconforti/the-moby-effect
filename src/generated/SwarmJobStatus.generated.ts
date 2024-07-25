import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmJobStatus extends Schema.Class<SwarmJobStatus>("SwarmJobStatus")(
    {
        JobIteration: Schema.NullOr(MobySchemasGenerated.SwarmVersion),
        LastExecution: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
    },
    {
        identifier: "SwarmJobStatus",
        title: "swarm.JobStatus",
    }
) {}
