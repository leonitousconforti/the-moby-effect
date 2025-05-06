import * as Schema from "effect/Schema";

export class SwarmNodeStatus extends Schema.Class<SwarmNodeStatus>("SwarmNodeStatus")(
    {
        State: Schema.optional(
            Schema.Literal("unknown", "down", "ready", "disconnected").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L119-L131",
            })
        ),
        Message: Schema.optional(Schema.String),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNodeStatus",
        title: "swarm.NodeStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L93-L98",
    }
) {}
