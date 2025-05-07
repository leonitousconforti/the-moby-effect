import * as Schema from "effect/Schema";
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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L136-L151",
    }
) {}
