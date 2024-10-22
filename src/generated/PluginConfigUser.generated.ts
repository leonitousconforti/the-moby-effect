import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PluginConfigUser extends Schema.Class<PluginConfigUser>("PluginConfigUser")(
    {
        GID: Schema.optional(MobySchemas.UInt32),
        UID: Schema.optional(MobySchemas.UInt32),
    },
    {
        identifier: "PluginConfigUser",
        title: "types.PluginConfigUser",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L173-L182",
    }
) {}
