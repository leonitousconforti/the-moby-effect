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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L190-L198",
    }
) {}
