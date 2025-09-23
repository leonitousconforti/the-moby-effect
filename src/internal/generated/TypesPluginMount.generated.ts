import * as Schema from "effect/Schema";

export class TypesPluginMount extends Schema.Class<TypesPluginMount>("TypesPluginMount")(
    {
        Description: Schema.String,
        Destination: Schema.String,
        Name: Schema.String,
        Options: Schema.NullOr(Schema.Array(Schema.String)),
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Source: Schema.NullOr(Schema.String),
        Type: Schema.String,
    },
    {
        identifier: "TypesPluginMount",
        title: "types.PluginMount",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginMount",
    }
) {}
