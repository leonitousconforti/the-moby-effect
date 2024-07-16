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
    }
) {}
