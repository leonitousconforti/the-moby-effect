import * as Schema from "@effect/schema/Schema";

export class SwarmNamedGenericResource extends Schema.Class<SwarmNamedGenericResource>("SwarmNamedGenericResource")(
    {
        Kind: Schema.optional(Schema.String),
        Value: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNamedGenericResource",
        title: "swarm.NamedGenericResource",
    }
) {}
