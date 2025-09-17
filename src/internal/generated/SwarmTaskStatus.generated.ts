import * as Schema from "effect/Schema";
import * as SwarmContainerStatus from "./SwarmContainerStatus.generated.js";
import * as SwarmPortStatus from "./SwarmPortStatus.generated.js";

export class SwarmTaskStatus extends Schema.Class<SwarmTaskStatus>("SwarmTaskStatus")(
    {
        Timestamp: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        State: Schema.optional(Schema.String),
        Message: Schema.optional(Schema.String),
        Err: Schema.optional(Schema.String),
        ContainerStatus: Schema.optionalWith(SwarmContainerStatus.SwarmContainerStatus, { nullable: true }),
        PortStatus: Schema.optionalWith(SwarmPortStatus.SwarmPortStatus, { nullable: true }),
    },
    {
        identifier: "SwarmTaskStatus",
        title: "swarm.TaskStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TaskStatus",
    }
) {}
