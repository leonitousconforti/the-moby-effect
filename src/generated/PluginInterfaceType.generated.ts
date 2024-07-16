import * as Schema from "@effect/schema/Schema";

export class PluginInterfaceType extends Schema.Class<PluginInterfaceType>("PluginInterfaceType")(
    {
        Capability: Schema.String,
        Prefix: Schema.String,
        Version: Schema.String,
    },
    {
        identifier: "PluginInterfaceType",
        title: "types.PluginInterfaceType",
    }
) {}
