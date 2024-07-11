import * as Schema from "@effect/schema/Schema";

export class PluginDisableOptions extends Schema.Class<PluginDisableOptions>("PluginDisableOptions")({
    Force: Schema.Boolean,
}) {}
