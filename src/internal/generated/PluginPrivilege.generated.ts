import * as Schema from "effect/Schema";

export class PluginPrivilege extends Schema.Class<PluginPrivilege>("PluginPrivilege")(
    {
        name: Schema.optional(Schema.String),
        description: Schema.optional(Schema.String),
        value: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "PluginPrivilege",
        title: "runtime.PluginPrivilege",
        documentation: "",
    }
) {}
