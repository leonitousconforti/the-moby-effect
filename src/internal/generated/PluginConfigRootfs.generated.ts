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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L162-L171",
    }
) {}
