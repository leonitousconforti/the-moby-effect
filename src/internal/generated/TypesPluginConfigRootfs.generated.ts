import * as Schema from "effect/Schema";

export class TypesPluginConfigRootfs extends Schema.Class<TypesPluginConfigRootfs>("TypesPluginConfigRootfs")(
    {
        diff_ids: Schema.NullOr(Schema.Array(Schema.String)),
        type: Schema.optional(Schema.String),
    },
    {
        identifier: "TypesPluginConfigRootfs",
        title: "types.PluginConfigRootfs",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigRootfs",
    }
) {}
