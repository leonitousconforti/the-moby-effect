import * as Schema from "effect/Schema";

export class PluginConfigNetwork extends Schema.Class<PluginConfigNetwork>("PluginConfigNetwork")(
    {
        Type: Schema.String,
    },
    {
        identifier: "PluginConfigNetwork",
        title: "types.PluginConfigNetwork",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigNetwork",
    }
) {}
