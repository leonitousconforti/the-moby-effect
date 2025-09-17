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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#Plugin",
    }
) {}
