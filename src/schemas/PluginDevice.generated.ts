import * as Schema from "@effect/schema/Schema";

export class PluginDevice extends Schema.Class<PluginDevice>("PluginDevice")({
    Description: Schema.String,
    Name: Schema.String,
    Path: Schema.String,
    Settable: Schema.Array(Schema.String),
}) {}
