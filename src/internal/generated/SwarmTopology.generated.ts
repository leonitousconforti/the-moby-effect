import * as Schema from "effect/Schema";

export class SwarmTopology extends Schema.Class<SwarmTopology>("SwarmTopology")(
    {
        Segments: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "SwarmTopology",
        title: "swarm.Topology",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Topology",
    }
) {}
