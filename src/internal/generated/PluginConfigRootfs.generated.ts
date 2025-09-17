import * as Schema from "effect/Schema";

export class PluginConfigRootfs extends Schema.Class<PluginConfigRootfs>("PluginConfigRootfs")(
    {
        diff_ids: Schema.NullOr(Schema.Array(Schema.String)),
        type: Schema.optional(Schema.String),
    },
    {
        identifier: "PluginConfigRootfs",
        title: "types.PluginConfigRootfs",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigRootfs",
    }
) {}
