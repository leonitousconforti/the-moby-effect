import * as Schema from "@effect/schema/Schema";

export class EventActor extends Schema.Class<EventActor>("EventActor")(
    {
        ID: Schema.String,
        Attributes: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "EventActor",
        title: "events.Actor",
    }
) {}
