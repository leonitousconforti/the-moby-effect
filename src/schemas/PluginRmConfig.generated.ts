import * as Schema from "@effect/schema/Schema";

export class PluginRmConfig extends Schema.Class<PluginRmConfig>("PluginRmConfig")({
    ForceRemove: Schema.Boolean,
}) {}
