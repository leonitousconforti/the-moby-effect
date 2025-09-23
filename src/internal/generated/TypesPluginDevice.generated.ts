import * as Schema from "effect/Schema";

export class TypesPluginDevice extends Schema.Class<TypesPluginDevice>("TypesPluginDevice")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Path: Schema.NullOr(Schema.String),
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "TypesPluginDevice",
        title: "types.PluginDevice",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginDevice",
    }
) {}
