import * as Schema from "effect/Schema";

export class PluginConfigArgs extends Schema.Class<PluginConfigArgs>("PluginConfigArgs")(
    {
        Description: Schema.String,
        Name: Schema.String,
        Settable: Schema.NullOr(Schema.Array(Schema.String)),
        Value: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginConfigArgs",
        title: "types.PluginConfigArgs",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L99-L118",
    }
) {}
