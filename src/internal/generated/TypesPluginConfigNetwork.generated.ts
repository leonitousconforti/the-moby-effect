import * as Schema from "effect/Schema";

export class TypesPluginConfigNetwork extends Schema.Class<TypesPluginConfigNetwork>("TypesPluginConfigNetwork")(
    {
        Type: Schema.String,
    },
    {
        identifier: "TypesPluginConfigNetwork",
        title: "types.PluginConfigNetwork",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigNetwork",
    }
) {}
