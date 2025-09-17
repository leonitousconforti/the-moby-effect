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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginInterfaceType",
    }
) {}
