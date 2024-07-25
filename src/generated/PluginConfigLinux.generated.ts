import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginConfigLinux extends Schema.Class<PluginConfigLinux>("PluginConfigLinux")(
    {
        AllowAllDevices: Schema.Boolean,
        Capabilities: Schema.NullOr(Schema.Array(Schema.String)),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.PluginDevice))),
    },
    {
        identifier: "PluginConfigLinux",
        title: "types.PluginConfigLinux",
    }
) {}
