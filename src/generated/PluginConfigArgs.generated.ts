import * as Schema from "@effect/schema/Schema";

export class PluginConfigArgs extends Schema.Class<PluginConfigArgs>("PluginConfigArgs")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginConfigArgs",
        title: "types.PluginConfigArgs",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L99-L118",
    }
) {}
