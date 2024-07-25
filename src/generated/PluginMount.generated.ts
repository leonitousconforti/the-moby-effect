import * as Schema from "@effect/schema/Schema";

export class PluginMount extends Schema.Class<PluginMount>("PluginMount")(
    {
        Description: Schema.String,
        Destination: Schema.String,
        Name: Schema.String,
        Options: Schema.NullOr(Schema.Array(Schema.String)),
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Source: Schema.NullOr(Schema.String),
        Type: Schema.String,
    },
    {
        identifier: "PluginMount",
        title: "types.PluginMount",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin_mount.go#L6-L37",
    }
) {}
