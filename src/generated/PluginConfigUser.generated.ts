import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PluginConfigUser extends Schema.Class<PluginConfigUser>("PluginConfigUser")(
    {
        GID: Schema.optional(MobySchemas.UInt32, { nullable: true }),
        UID: Schema.optional(MobySchemas.UInt32, { nullable: true }),
    },
    {
        identifier: "PluginConfigUser",
        title: "types.PluginConfigUser",
    }
) {}
