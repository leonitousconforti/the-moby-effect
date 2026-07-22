import * as Schema from "effect/Schema";

export class RuntimePluginPrivilege extends Schema.Class<RuntimePluginPrivilege>("RuntimePluginPrivilege")(
    {
        Name: Schema.optional(Schema.String),
        Description: Schema.optional(Schema.String),
        Value: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "RuntimePluginPrivilege",
        title: "runtime.PluginPrivilege",
        documentation: "",
    }
) {}
