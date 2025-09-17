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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigUser",
    }
) {}
