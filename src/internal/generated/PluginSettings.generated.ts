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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L184-L203",
    }
) {}
