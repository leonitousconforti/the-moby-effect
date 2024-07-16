import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PluginConfigUser extends Schema.Class<PluginConfigUser>("PluginConfigUser")(
    {
        GID: Schema.optional(MobySchemas.UInt32),
        UID: Schema.optional(MobySchemas.UInt32),
    },
    {
        identifier: "PluginConfigUser",
        title: "types.PluginConfigUser",
    }
) {}
