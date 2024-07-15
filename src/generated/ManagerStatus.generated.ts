import * as Schema from "@effect/schema/Schema";

export class ManagerStatus extends Schema.Class<ManagerStatus>("ManagerStatus")(
    {
        Leader: Schema.optional(Schema.Boolean, { nullable: true }),
        Reachability: Schema.optional(Schema.String, { nullable: true }),
        Addr: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "ManagerStatus",
        title: "swarm.ManagerStatus",
    }
) {}
