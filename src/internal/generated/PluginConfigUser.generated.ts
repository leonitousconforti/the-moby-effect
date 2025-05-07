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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L173-L182",
    }
) {}
