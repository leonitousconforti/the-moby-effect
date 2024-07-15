import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginConfigInterface extends Schema.Class<PluginConfigInterface>("PluginConfigInterface")(
    {
        ProtocolScheme: Schema.optional(Schema.String, { nullable: true }),
        Socket: Schema.NullOr(Schema.String),
        Types: Schema.NullOr(Schema.Array(MobySchemasGenerated.PluginInterfaceType)),
    },
    {
        identifier: "PluginConfigInterface",
        title: "types.PluginConfigInterface",
    }
) {}
