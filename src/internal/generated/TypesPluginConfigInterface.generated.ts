import * as Schema from "effect/Schema";
import * as TypesPluginInterfaceType from "./TypesPluginInterfaceType.generated.js";

export class TypesPluginConfigInterface extends Schema.Class<TypesPluginConfigInterface>("TypesPluginConfigInterface")(
    {
        ProtocolScheme: Schema.optional(Schema.String),
        Socket: Schema.String,
        Types: Schema.NullOr(Schema.Array(Schema.NullOr(TypesPluginInterfaceType.TypesPluginInterfaceType))),
    },
    {
        identifier: "TypesPluginConfigInterface",
        title: "types.PluginConfigInterface",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigInterface",
    }
) {}
