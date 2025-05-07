import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin_env.go#L6-L25",
    }
) {}
