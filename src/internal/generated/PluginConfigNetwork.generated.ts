import * as Schema from "effect/Schema";

export class PluginConfigNetwork extends Schema.Class<PluginConfigNetwork>("PluginConfigNetwork")(
    {
        Type: Schema.String,
    },
    {
        identifier: "PluginConfigNetwork",
        title: "types.PluginConfigNetwork",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L153-L160",
    }
) {}
