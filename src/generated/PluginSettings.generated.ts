import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginSettings extends Schema.Class<PluginSettings>("PluginSettings")(
    {
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.PluginDevice))),
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.PluginMount))),
    },
    {
        identifier: "PluginSettings",
        title: "types.PluginSettings",
    }
) {}
