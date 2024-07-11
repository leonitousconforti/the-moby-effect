import * as Schema from "@effect/schema/Schema";

export class PluginsInfo extends Schema.Class<PluginsInfo>("PluginsInfo")({
    Volume: Schema.Array(Schema.String),
    Network: Schema.Array(Schema.String),
    Authorization: Schema.Array(Schema.String),
    Log: Schema.Array(Schema.String),
}) {}
