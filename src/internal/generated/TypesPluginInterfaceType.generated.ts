import * as Schema from "effect/Schema";

export class TypesPluginInterfaceType extends Schema.Class<TypesPluginInterfaceType>("TypesPluginInterfaceType")(
    {
        Capability: Schema.String,
        Prefix: Schema.String,
        Version: Schema.String,
    },
    {
        identifier: "TypesPluginInterfaceType",
        title: "types.PluginInterfaceType",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginInterfaceType",
    }
) {}
