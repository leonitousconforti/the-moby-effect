import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class EngineDescription extends Schema.Class<EngineDescription>("EngineDescription")({
    EngineVersion: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Plugins: Schema.Array(MobySchemas.PluginDescription),
}) {}
