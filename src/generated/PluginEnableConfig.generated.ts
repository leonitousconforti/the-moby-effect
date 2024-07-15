import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PluginEnableConfig extends Schema.Class<PluginEnableConfig>("PluginEnableConfig")(
    {
        Timeout: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "PluginEnableConfig",
        title: "types.PluginEnableConfig",
    }
) {}
