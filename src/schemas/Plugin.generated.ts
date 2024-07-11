import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Plugin extends Schema.Class<Plugin>("Plugin")({
    Config: MobySchemas.PluginConfig,
    Enabled: Schema.Boolean,
    ID: Schema.String,
    Name: Schema.String,
    PluginReference: Schema.String,
    Settings: MobySchemas.PluginSettings,
}) {}
