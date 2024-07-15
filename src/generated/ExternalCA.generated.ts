import * as Schema from "@effect/schema/Schema";

export class ExternalCA extends Schema.Class<ExternalCA>("ExternalCA")(
    {
        Protocol: Schema.NullOr(Schema.String),
        URL: Schema.NullOr(Schema.String),
        Options: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        CACert: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ExternalCA",
        title: "swarm.ExternalCA",
    }
) {}
