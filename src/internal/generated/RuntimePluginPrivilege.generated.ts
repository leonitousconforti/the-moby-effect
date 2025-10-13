import * as Schema from "effect/Schema";

export class RuntimePluginPrivilege extends Schema.Class<RuntimePluginPrivilege>("RuntimePluginPrivilege")(
    {
        Name: Schema.optional(Schema.String),
        Description: Schema.optional(Schema.String),
        Value: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RuntimePluginPrivilege",
        title: "runtime.PluginPrivilege",
        documentation: "",
    }
) {}
