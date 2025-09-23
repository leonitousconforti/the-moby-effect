import * as Schema from "effect/Schema";

export class RuntimePluginPrivilege extends Schema.Class<RuntimePluginPrivilege>("RuntimePluginPrivilege")(
    {
        name: Schema.optional(Schema.String),
        description: Schema.optional(Schema.String),
        value: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RuntimePluginPrivilege",
        title: "runtime.PluginPrivilege",
        documentation: "",
    }
) {}
