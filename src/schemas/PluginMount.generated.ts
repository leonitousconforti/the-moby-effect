import * as Schema from "@effect/schema/Schema";

export class PluginMount extends Schema.Class<PluginMount>("PluginMount")({
    Description: Schema.String,
    Destination: Schema.String,
    Name: Schema.String,
    Options: Schema.Array(Schema.String),
    Settable: Schema.Array(Schema.String),
    Source: Schema.String,
    Type: Schema.String,
}) {}
