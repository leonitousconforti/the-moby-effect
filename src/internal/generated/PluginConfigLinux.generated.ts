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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigLinux",
    }
) {}
