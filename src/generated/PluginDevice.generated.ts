import * as Schema from "@effect/schema/Schema";

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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin_device.go#L6-L25",
    }
) {}
