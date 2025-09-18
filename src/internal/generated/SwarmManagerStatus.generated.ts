import * as Schema from "effect/Schema";

export class SwarmManagerStatus extends Schema.Class<SwarmManagerStatus>("SwarmManagerStatus")(
    {
        Leader: Schema.optional(Schema.Boolean),
        Reachability: Schema.optional(Schema.Literal("unknown", "unreachable", "reachable")),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmManagerStatus",
        title: "swarm.ManagerStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ManagerStatus",
    }
) {}
