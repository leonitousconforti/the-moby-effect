import * as Schema from "@effect/schema/Schema";
import * as SwarmVersion from "./SwarmVersion.generated.js";

export class SwarmJobStatus extends Schema.Class<SwarmJobStatus>("SwarmJobStatus")(
    {
        JobIteration: Schema.NullOr(SwarmVersion.SwarmVersion),
        LastExecution: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
    },
    {
        identifier: "SwarmJobStatus",
        title: "swarm.JobStatus",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L186-L202",
    }
) {}
