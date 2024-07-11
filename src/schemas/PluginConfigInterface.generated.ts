import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginConfigInterface extends Schema.Class<PluginConfigInterface>("PluginConfigInterface")({
    ProtocolScheme: Schema.String,
    Socket: Schema.String,
    Types: Schema.Array(MobySchemas.PluginInterfaceType),
}) {}
