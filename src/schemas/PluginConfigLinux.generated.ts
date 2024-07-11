import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginConfigLinux extends Schema.Class<PluginConfigLinux>("PluginConfigLinux")({
    AllowAllDevices: Schema.Boolean,
    Capabilities: Schema.Array(Schema.String),
    Devices: Schema.Array(MobySchemas.PluginDevice),
}) {}
