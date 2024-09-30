import * as Schema from "@effect/schema/Schema";

export class EventActor extends Schema.Class<EventActor>("EventActor")(
    {
        ID: Schema.String,
        Attributes: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
    },
    {
        identifier: "EventActor",
        title: "events.Actor",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/events/events.go#L102-L110",
    }
) {}
