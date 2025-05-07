import * as Schema from "effect/Schema";
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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L186-L202",
    }
) {}
