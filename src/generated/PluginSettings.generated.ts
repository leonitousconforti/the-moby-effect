import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L184-L203",
    }
) {}
