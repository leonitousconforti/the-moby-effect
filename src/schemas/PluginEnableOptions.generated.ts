import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginEnableOptions extends Schema.Class<PluginEnableOptions>("PluginEnableOptions")({
    Timeout: MobySchemas.Int64,
}) {}
