import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginConfigUser extends Schema.Class<PluginConfigUser>("PluginConfigUser")({
    GID: MobySchemas.UInt32,
    UID: MobySchemas.UInt32,
}) {}
