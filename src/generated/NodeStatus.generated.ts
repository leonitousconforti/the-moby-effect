import * as Schema from "@effect/schema/Schema";

export class NodeStatus extends Schema.Class<NodeStatus>("NodeStatus")(
    {
        State: Schema.optional(Schema.String, { nullable: true }),
        Message: Schema.optional(Schema.String, { nullable: true }),
        Addr: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "NodeStatus",
        title: "swarm.NodeStatus",
    }
) {}
