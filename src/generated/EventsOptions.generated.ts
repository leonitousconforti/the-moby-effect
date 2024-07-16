import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class EventsOptions extends Schema.Class<EventsOptions>("EventsOptions")(
    {
        Since: Schema.String,
        Until: Schema.String,
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "EventsOptions",
        title: "types.EventsOptions",
    }
) {}
