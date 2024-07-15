import * as Schema from "@effect/schema/Schema";

export class PluginCreateOptions extends Schema.Class<PluginCreateOptions>("PluginCreateOptions")(
    {
        RepoName: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PluginCreateOptions",
        title: "types.PluginCreateOptions",
    }
) {}
