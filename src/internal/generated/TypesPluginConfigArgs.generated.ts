import * as Schema from "effect/Schema";

export class TypesPluginConfigArgs extends Schema.Class<TypesPluginConfigArgs>("TypesPluginConfigArgs")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "TypesPluginConfigArgs",
        title: "types.PluginConfigArgs",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigArgs",
    }
) {}
