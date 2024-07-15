import * as Schema from "@effect/schema/Schema";

export class NodeSpec extends Schema.Class<NodeSpec>("NodeSpec")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Role: Schema.optional(Schema.String, { nullable: true }),
        Availability: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "NodeSpec",
        title: "swarm.NodeSpec",
    }
) {}
