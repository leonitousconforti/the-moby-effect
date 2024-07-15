import * as Schema from "@effect/schema/Schema";

export class PluginInterfaceType extends Schema.Class<PluginInterfaceType>("PluginInterfaceType")(
    {
        Capability: Schema.NullOr(Schema.String),
        Prefix: Schema.NullOr(Schema.String),
        Version: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PluginInterfaceType",
        title: "types.PluginInterfaceType",
    }
) {}
