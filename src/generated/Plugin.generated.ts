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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L6-L31",
    }
) {}
