import * as Schema from "effect/Schema";

export class EventActor extends Schema.Class<EventActor>("EventActor")(
    {
        ID: Schema.String,
        Attributes: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "EventActor",
        title: "events.Actor",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/events/events.go#L102-L110",
    }
) {}
