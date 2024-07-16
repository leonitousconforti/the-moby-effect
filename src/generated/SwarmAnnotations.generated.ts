import * as Schema from "@effect/schema/Schema";

export class SwarmAnnotations extends Schema.Class<SwarmAnnotations>("SwarmAnnotations")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "SwarmAnnotations",
        title: "swarm.Annotations",
    }
) {}
