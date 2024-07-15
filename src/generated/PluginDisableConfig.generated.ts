import * as Schema from "@effect/schema/Schema";

export class PluginDisableConfig extends Schema.Class<PluginDisableConfig>("PluginDisableConfig")(
    {
        ForceDisable: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "PluginDisableConfig",
        title: "types.PluginDisableConfig",
    }
) {}
