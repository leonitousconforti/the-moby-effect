import * as Schema from "@effect/schema/Schema";
import * as PluginDevice from "./PluginDevice.generated.js";

export class PluginConfigLinux extends Schema.Class<PluginConfigLinux>("PluginConfigLinux")(
    {
        AllowAllDevices: Schema.Boolean,
        Capabilities: Schema.NullOr(Schema.Array(Schema.String)),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(PluginDevice.PluginDevice))),
    },
    {
        identifier: "PluginConfigLinux",
        title: "types.PluginConfigLinux",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L136-L151",
    }
) {}
