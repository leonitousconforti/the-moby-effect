import * as Schema from "@effect/schema/Schema";

export class SwarmNodeSpec extends Schema.Class<SwarmNodeSpec>("SwarmNodeSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Role: Schema.optional(Schema.String),
        Availability: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNodeSpec",
        title: "swarm.NodeSpec",
    }
) {}
