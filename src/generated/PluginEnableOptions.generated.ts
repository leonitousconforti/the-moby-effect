import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PluginEnableOptions extends Schema.Class<PluginEnableOptions>("PluginEnableOptions")(
    {
        Timeout: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "PluginEnableOptions",
        title: "types.PluginEnableOptions",
    }
) {}
