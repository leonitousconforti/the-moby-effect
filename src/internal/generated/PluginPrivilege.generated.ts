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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin_responses.go#L48-L54",
    }
) {}
