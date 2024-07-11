import * as Schema from "@effect/schema/Schema";

export class PluginPrivilege extends Schema.Class<PluginPrivilege>("PluginPrivilege")({
    Name: Schema.String,
    Description: Schema.String,
    Value: Schema.Array(Schema.String),
}) {}
