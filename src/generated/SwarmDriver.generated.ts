import * as Schema from "@effect/schema/Schema";

export class SwarmDriver extends Schema.Class<SwarmDriver>("SwarmDriver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmDriver",
        title: "swarm.Driver",
    }
) {}
