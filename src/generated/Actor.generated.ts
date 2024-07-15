import * as Schema from "@effect/schema/Schema";

export class Actor extends Schema.Class<Actor>("Actor")(
    {
        ID: Schema.NullOr(Schema.String),
        Attributes: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "Actor",
        title: "events.Actor",
    }
) {}
