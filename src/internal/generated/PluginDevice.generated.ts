import * as Schema from "effect/Schema";

export class PluginDevice extends Schema.Class<PluginDevice>("PluginDevice")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Path: Schema.NullOr(Schema.String),
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginDevice",
        title: "types.PluginDevice",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin_device.go#L6-L25",
    }
) {}
