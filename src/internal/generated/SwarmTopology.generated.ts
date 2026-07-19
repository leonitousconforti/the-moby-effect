import * as Schema from "effect/Schema";

export class SwarmTopology extends Schema.Class<SwarmTopology>("SwarmTopology")(
    {
        Segments: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "SwarmTopology",
        title: "swarm.Topology",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Topology",
    }
) {}
