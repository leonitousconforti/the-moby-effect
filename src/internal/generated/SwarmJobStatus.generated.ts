import * as Schema from "effect/Schema";
import * as SwarmVersion from "./SwarmVersion.generated.ts";

export class SwarmJobStatus extends Schema.Class<SwarmJobStatus>("SwarmJobStatus")(
    {
        JobIteration: Schema.NullOr(SwarmVersion.SwarmVersion),
        LastExecution: Schema.optional(Schema.NullOr(Schema.DateFromString)),
    },
    {
        identifier: "SwarmJobStatus",
        title: "swarm.JobStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#JobStatus",
    }
) {}
