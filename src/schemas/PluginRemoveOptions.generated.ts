import * as Schema from "@effect/schema/Schema";

export class PluginRemoveOptions extends Schema.Class<PluginRemoveOptions>("PluginRemoveOptions")({
    Force: Schema.Boolean,
}) {}
