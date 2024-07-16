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
    }
) {}
