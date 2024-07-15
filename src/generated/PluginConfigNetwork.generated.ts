import * as Schema from "@effect/schema/Schema";

export class PluginConfigNetwork extends Schema.Class<PluginConfigNetwork>("PluginConfigNetwork")(
    {
        Type: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PluginConfigNetwork",
        title: "types.PluginConfigNetwork",
    }
) {}
