import * as Schema from "@effect/schema/Schema";

export class SwarmNodeStatus extends Schema.Class<SwarmNodeStatus>("SwarmNodeStatus")(
    {
        State: Schema.optional(Schema.String),
        Message: Schema.optional(Schema.String),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNodeStatus",
        title: "swarm.NodeStatus",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L93-L98",
    }
) {}
