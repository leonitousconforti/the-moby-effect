import * as Schema from "effect/Schema";

export class PluginConfigRootfs extends Schema.Class<PluginConfigRootfs>("PluginConfigRootfs")(
    {
        diff_ids: Schema.NullOr(Schema.Array(Schema.String)),
        type: Schema.optional(Schema.String),
    },
    {
        identifier: "PluginConfigRootfs",
        title: "types.PluginConfigRootfs",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L162-L171",
    }
) {}
