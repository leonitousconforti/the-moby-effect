import * as Schema from "effect/Schema";
import * as SwarmContainerStatus from "./SwarmContainerStatus.generated.ts";
import * as SwarmPortStatus from "./SwarmPortStatus.generated.ts";

export class SwarmTaskStatus extends Schema.Class<SwarmTaskStatus>("SwarmTaskStatus")(
    {
        Timestamp: Schema.optional(Schema.NullOr(Schema.DateFromString)),
        State: Schema.optional(Schema.Literals(["new", "allocated", "pending", "assigned", "accepted", "preparing", "ready", "starting", "running", "complete", "shutdown", "failed", "rejected", "remove", "orphaned"])),
        Message: Schema.optional(Schema.String),
        Err: Schema.optional(Schema.String),
        ContainerStatus: Schema.optional(Schema.NullOr(SwarmContainerStatus.SwarmContainerStatus)),
        PortStatus: Schema.optional(Schema.NullOr(SwarmPortStatus.SwarmPortStatus)),
    },
    {
        identifier: "SwarmTaskStatus",
        title: "swarm.TaskStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TaskStatus",
    }
) {}
