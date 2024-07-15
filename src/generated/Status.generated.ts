import * as Schema from "@effect/schema/Schema";

export class Status extends Schema.Class<Status>("Status")(
    {
        NodeState: Schema.NullOr(Schema.String),
        ControlAvailable: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "Status",
        title: "swarm.Status",
    }
) {}
