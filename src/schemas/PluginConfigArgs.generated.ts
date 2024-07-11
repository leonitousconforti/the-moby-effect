import * as Schema from "@effect/schema/Schema";

export class PluginConfigArgs extends Schema.Class<PluginConfigArgs>("PluginConfigArgs")({
    Description: Schema.String,
    Name: Schema.String,
    Settable: Schema.Array(Schema.String),
    Value: Schema.Array(Schema.String),
}) {}
