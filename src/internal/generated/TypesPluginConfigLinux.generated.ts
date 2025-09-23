import * as Schema from "effect/Schema";
import * as TypesPluginDevice from "./TypesPluginDevice.generated.js";

export class TypesPluginConfigLinux extends Schema.Class<TypesPluginConfigLinux>("TypesPluginConfigLinux")(
    {
        AllowAllDevices: Schema.Boolean,
        Capabilities: Schema.NullOr(Schema.Array(Schema.String)),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(TypesPluginDevice.TypesPluginDevice))),
    },
    {
        identifier: "TypesPluginConfigLinux",
        title: "types.PluginConfigLinux",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigLinux",
    }
) {}
