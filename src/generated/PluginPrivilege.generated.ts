import * as Schema from "@effect/schema/Schema";

export class PluginPrivilege extends Schema.Class<PluginPrivilege>("PluginPrivilege")(
    {
        name: Schema.optional(Schema.String),
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "PluginPrivilege",
        title: "runtime.PluginPrivilege",
    }
) {}
