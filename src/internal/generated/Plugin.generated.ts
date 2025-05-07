import * as Schema from "effect/Schema";
import * as PluginConfig from "./PluginConfig.generated.js";
import * as PluginSettings from "./PluginSettings.generated.js";

export class Plugin extends Schema.Class<Plugin>("Plugin")(
    {
        Config: Schema.NullOr(PluginConfig.PluginConfig),
        Enabled: Schema.Boolean,
        Id: Schema.optional(Schema.String),
        Name: Schema.String,
        PluginReference: Schema.optional(Schema.String),
        Settings: Schema.NullOr(PluginSettings.PluginSettings),
    },
    {
        identifier: "Plugin",
        title: "types.Plugin",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L6-L31",
    }
) {}
