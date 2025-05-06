import * as Schema from "effect/Schema";

export class SwarmTopology extends Schema.Class<SwarmTopology>("SwarmTopology")(
    {
        Segments: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "SwarmTopology",
        title: "swarm.Topology",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L133-L139",
    }
) {}
