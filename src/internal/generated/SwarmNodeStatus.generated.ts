import * as Schema from "effect/Schema";

export class SwarmNodeStatus extends Schema.Class<SwarmNodeStatus>("SwarmNodeStatus")(
    {
        State: Schema.optional(Schema.Literal("unknown", "down", "ready", "disconnected")),
        Message: Schema.optional(Schema.String),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNodeStatus",
        title: "swarm.NodeStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeStatus",
    }
) {}
