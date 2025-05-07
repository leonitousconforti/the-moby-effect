import * as Schema from "effect/Schema";

export class SwarmManagerStatus extends Schema.Class<SwarmManagerStatus>("SwarmManagerStatus")(
    {
        Leader: Schema.optional(Schema.Boolean),
        Reachability: Schema.optional(
            Schema.Literal("unknown", "reachable", "unreachable").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L100-L110",
            })
        ),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmManagerStatus",
        title: "swarm.ManagerStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L112-L117",
    }
) {}
