import * as Schema from "@effect/schema/Schema";

export class PluginDescription extends Schema.Class<PluginDescription>("PluginDescription")({
    Type: Schema.String,
    Name: Schema.String,
}) {}
