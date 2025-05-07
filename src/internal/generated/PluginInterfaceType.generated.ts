import * as Schema from "effect/Schema";

export class PluginInterfaceType extends Schema.Class<PluginInterfaceType>("PluginInterfaceType")(
    {
        Capability: Schema.String,
        Prefix: Schema.String,
        Version: Schema.String,
    },
    {
        identifier: "PluginInterfaceType",
        title: "types.PluginInterfaceType",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin_interface_type.go#L6-L21",
    }
) {}
