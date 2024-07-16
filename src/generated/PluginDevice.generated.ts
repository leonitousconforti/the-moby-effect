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
    }
) {}
