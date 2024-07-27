import * as Schema from "@effect/schema/Schema";

export class SwarmTopology extends Schema.Class<SwarmTopology>("SwarmTopology")(
    {
        Segments: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "SwarmTopology",
        title: "swarm.Topology",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L133-L139",
    }
) {}
