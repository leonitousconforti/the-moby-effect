import * as Schema from "effect/Schema";
import * as PluginInterfaceType from "./PluginInterfaceType.generated.js";

export class PluginConfigInterface extends Schema.Class<PluginConfigInterface>("PluginConfigInterface")(
    {
        ProtocolScheme: Schema.optional(Schema.String),
        Socket: Schema.String,
        Types: Schema.NullOr(Schema.Array(Schema.NullOr(PluginInterfaceType.PluginInterfaceType))),
    },
    {
        identifier: "PluginConfigInterface",
        title: "types.PluginConfigInterface",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigInterface",
    }
) {}
