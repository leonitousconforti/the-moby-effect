import * as Schema from "@effect/schema/Schema";

export class Annotations extends Schema.Class<Annotations>("Annotations")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "Annotations",
        title: "swarm.Annotations",
    }
) {}
