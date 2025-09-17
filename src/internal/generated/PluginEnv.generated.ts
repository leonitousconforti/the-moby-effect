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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginEnv",
    }
) {}
