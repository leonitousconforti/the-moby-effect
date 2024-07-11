import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginEnableConfig extends Schema.Class<PluginEnableConfig>("PluginEnableConfig")({
    Timeout: MobySchemas.Int64,
}) {}
