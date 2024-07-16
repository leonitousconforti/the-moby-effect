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
    }
) {}
