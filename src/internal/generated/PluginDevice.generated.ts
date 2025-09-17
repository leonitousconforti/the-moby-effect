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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginDevice",
    }
) {}
