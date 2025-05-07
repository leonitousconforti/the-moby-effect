import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin_mount.go#L6-L37",
    }
) {}
