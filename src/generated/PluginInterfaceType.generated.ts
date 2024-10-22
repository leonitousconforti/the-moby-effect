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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin_interface_type.go#L6-L21",
    }
) {}
