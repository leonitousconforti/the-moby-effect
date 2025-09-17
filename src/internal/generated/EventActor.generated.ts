import * as Schema from "effect/Schema";

export class EventActor extends Schema.Class<EventActor>("EventActor")(
    {
        ID: Schema.String,
        Attributes: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "EventActor",
        title: "events.Actor",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/events#Actor",
    }
) {}
