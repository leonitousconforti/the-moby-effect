import * as Schema from "@effect/schema/Schema";

export class SwarmManagerStatus extends Schema.Class<SwarmManagerStatus>("SwarmManagerStatus")(
    {
        Leader: Schema.optional(Schema.Boolean),
        Reachability: Schema.optional(Schema.String),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmManagerStatus",
        title: "swarm.ManagerStatus",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L112-L117",
    }
) {}
