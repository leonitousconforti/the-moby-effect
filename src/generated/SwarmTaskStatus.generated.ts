import * as Schema from "@effect/schema/Schema";
import * as SwarmContainerStatus from "./SwarmContainerStatus.generated.js";
import * as SwarmPortStatus from "./SwarmPortStatus.generated.js";
import * as Time from "./Time.generated.js";

export class SwarmTaskStatus extends Schema.Class<SwarmTaskStatus>("SwarmTaskStatus")(
    {
        Timestamp: Schema.optionalWith(Time.Time, { nullable: true }),
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L190-L198",
    }
) {}
