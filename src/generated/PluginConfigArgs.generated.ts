import * as Schema from "@effect/schema/Schema";

export class PluginConfigArgs extends Schema.Class<PluginConfigArgs>("PluginConfigArgs")(
    {
        Description: Schema.NullOr(Schema.String),
        Name: Schema.NullOr(Schema.String),
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginConfigArgs",
        title: "types.PluginConfigArgs",
    }
) {}
