import * as Schema from "@effect/schema/Schema";

export class SELinuxContext extends Schema.Class<SELinuxContext>("SELinuxContext")(
    {
        Disable: Schema.NullOr(Schema.Boolean),
        User: Schema.NullOr(Schema.String),
        Role: Schema.NullOr(Schema.String),
        Type: Schema.NullOr(Schema.String),
        Level: Schema.NullOr(Schema.String),
    },
    {
        identifier: "SELinuxContext",
        title: "swarm.SELinuxContext",
    }
) {}
