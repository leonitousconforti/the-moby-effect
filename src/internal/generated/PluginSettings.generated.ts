import * as Schema from "effect/Schema";
import * as PluginDevice from "./PluginDevice.generated.js";
import * as PluginMount from "./PluginMount.generated.js";

export class PluginSettings extends Schema.Class<PluginSettings>("PluginSettings")(
    {
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(PluginDevice.PluginDevice))),
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(PluginMount.PluginMount))),
    },
    {
        identifier: "PluginSettings",
        title: "types.PluginSettings",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginSettings",
    }
) {}
