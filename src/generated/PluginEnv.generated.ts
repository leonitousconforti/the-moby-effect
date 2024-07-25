import * as Schema from "@effect/schema/Schema";

export class PluginEnv extends Schema.Class<PluginEnv>("PluginEnv")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PluginEnv",
        title: "types.PluginEnv",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin_env.go#L6-L25",
    }
) {}
