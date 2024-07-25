import * as Schema from "@effect/schema/Schema";

export class PluginPrivilege extends Schema.Class<PluginPrivilege>("PluginPrivilege")(
    {
        name: Schema.optional(Schema.String),
        description: Schema.optional(Schema.String),
        value: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "PluginPrivilege",
        title: "runtime.PluginPrivilege",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin_responses.go#L48-L54",
    }
) {}
