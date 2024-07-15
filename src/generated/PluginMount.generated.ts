import * as Schema from "@effect/schema/Schema";

export class PluginMount extends Schema.Class<PluginMount>("PluginMount")(
    {
        Description: Schema.NullOr(Schema.String),
        Destination: Schema.NullOr(Schema.String),
        Name: Schema.NullOr(Schema.String),
        Options: Schema.NullOr(Schema.Array(Schema.String)),
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Source: Schema.NullOr(Schema.String),
        Type: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PluginMount",
        title: "types.PluginMount",
    }
) {}
