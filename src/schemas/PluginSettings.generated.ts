import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginSettings extends Schema.Class<PluginSettings>("PluginSettings")({
    Args: Schema.Array(Schema.String),
    Devices: Schema.Array(MobySchemas.PluginDevice),
    Env: Schema.Array(Schema.String),
    Mounts: Schema.Array(MobySchemas.PluginMount),
}) {}
