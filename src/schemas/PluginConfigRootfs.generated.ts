import * as Schema from "@effect/schema/Schema";

export class PluginConfigRootfs extends Schema.Class<PluginConfigRootfs>("PluginConfigRootfs")({
    DiffIds: Schema.Array(Schema.String),
    Type: Schema.String,
}) {}
