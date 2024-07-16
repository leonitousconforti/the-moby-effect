import * as Schema from "@effect/schema/Schema";

export class PluginEnv extends Schema.Class<PluginEnv>("PluginEnv")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PluginEnv",
        title: "types.PluginEnv",
    }
) {}
