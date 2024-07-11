import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginSpec extends Schema.Class<PluginSpec>("PluginSpec")({
    Name: Schema.String,
    Remote: Schema.String,
    Privileges: Schema.Array(MobySchemas.PluginPrivilege),
    Disabled: Schema.Boolean,
    Env: Schema.Array(Schema.String),
}) {}
