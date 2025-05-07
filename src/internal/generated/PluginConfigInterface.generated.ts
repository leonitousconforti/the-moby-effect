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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L120-L134",
    }
) {}
