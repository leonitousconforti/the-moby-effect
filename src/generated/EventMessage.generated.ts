import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class EventMessage extends Schema.Class<EventMessage>("EventMessage")(
    {
        status: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        Type: Schema.String,
        Action: Schema.String,
        Actor: MobySchemasGenerated.EventActor,
        scope: Schema.optional(Schema.String),
        time: Schema.optional(MobySchemas.Int64),
        timeNano: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "EventMessage",
        title: "events.Message",
    }
) {}
