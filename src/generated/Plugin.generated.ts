import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Plugin extends Schema.Class<Plugin>("Plugin")(
    {
        Config: Schema.NullOr(MobySchemasGenerated.PluginConfig),
        Enabled: Schema.Boolean,
        Id: Schema.optional(Schema.String),
        Name: Schema.String,
        PluginReference: Schema.optional(Schema.String),
        Settings: Schema.NullOr(MobySchemasGenerated.PluginSettings),
    },
    {
        identifier: "Plugin",
        title: "types.Plugin",
    }
) {}
