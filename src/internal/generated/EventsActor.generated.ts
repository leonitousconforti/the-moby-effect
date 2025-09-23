import * as Schema from "effect/Schema";

export class EventsActor extends Schema.Class<EventsActor>("EventsActor")(
    {
        ID: Schema.String,
        Attributes: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "EventsActor",
        title: "events.Actor",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/events#Actor",
    }
) {}
