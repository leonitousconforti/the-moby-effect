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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#JobStatus",
    }
) {}
