import * as Schema from "@effect/schema/Schema";

export class PluginDisableConfig extends Schema.Class<PluginDisableConfig>("PluginDisableConfig")({
    ForceDisable: Schema.Boolean,
}) {}
