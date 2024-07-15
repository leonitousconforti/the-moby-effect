import * as Schema from "@effect/schema/Schema";

export class PluginPrivilege extends Schema.Class<PluginPrivilege>("PluginPrivilege")(
    {
        Name: Schema.NullOr(Schema.String),
        Description: Schema.NullOr(Schema.String),
        Value: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginPrivilege",
        title: "types.PluginPrivilege",
    }
) {}
