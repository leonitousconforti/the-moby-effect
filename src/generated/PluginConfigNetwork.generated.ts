import * as Schema from "effect/Schema";

export class PluginConfigNetwork extends Schema.Class<PluginConfigNetwork>("PluginConfigNetwork")(
    {
        Type: Schema.String,
    },
    {
        identifier: "PluginConfigNetwork",
        title: "types.PluginConfigNetwork",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L153-L160",
    }
) {}
