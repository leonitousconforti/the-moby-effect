import * as Schema from "@effect/schema/Schema";

export class Topology extends Schema.Class<Topology>("Topology")(
    {
        Segments: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "Topology",
        title: "volume.Topology",
    }
) {}
