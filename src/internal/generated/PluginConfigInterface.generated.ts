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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L120-L134",
    }
) {}
