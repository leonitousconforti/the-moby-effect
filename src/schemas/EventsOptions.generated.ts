import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class EventsOptions extends Schema.Class<EventsOptions>("EventsOptions")({
    Since: Schema.String,
    Until: Schema.String,
    Filters: MobySchemas.Args,
}) {}
