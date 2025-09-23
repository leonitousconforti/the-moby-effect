import * as Schema from "effect/Schema";

export class TypesPluginEnv extends Schema.Class<TypesPluginEnv>("TypesPluginEnv")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.String),
    },
    {
        identifier: "TypesPluginEnv",
        title: "types.PluginEnv",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginEnv",
    }
) {}
