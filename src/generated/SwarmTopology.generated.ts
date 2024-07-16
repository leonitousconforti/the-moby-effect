import * as Schema from "@effect/schema/Schema";

export class SwarmTopology extends Schema.Class<SwarmTopology>("SwarmTopology")(
    {
        Segments: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmTopology",
        title: "swarm.Topology",
    }
) {}
