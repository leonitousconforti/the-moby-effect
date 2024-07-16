import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Plugin extends Schema.Class<Plugin>("Plugin")(
    {
        Config: MobySchemasGenerated.PluginConfig,
        Enabled: Schema.Boolean,
        Id: Schema.optional(Schema.String),
        Name: Schema.String,
        PluginReference: Schema.optional(Schema.String),
        Settings: MobySchemasGenerated.PluginSettings,
    },
    {
        identifier: "Plugin",
        title: "types.Plugin",
    }
) {}
