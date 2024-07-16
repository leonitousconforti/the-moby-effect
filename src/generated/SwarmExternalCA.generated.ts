import * as Schema from "@effect/schema/Schema";

export class SwarmExternalCA extends Schema.Class<SwarmExternalCA>("SwarmExternalCA")(
    {
        Protocol: Schema.String,
        URL: Schema.String,
        Options: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        CACert: Schema.String,
    },
    {
        identifier: "SwarmExternalCA",
        title: "swarm.ExternalCA",
    }
) {}
