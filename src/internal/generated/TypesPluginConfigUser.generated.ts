import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class TypesPluginConfigUser extends Schema.Class<TypesPluginConfigUser>("TypesPluginConfigUser")(
    {
        GID: Schema.optional(EffectSchemas.Number.U32),
        UID: Schema.optional(EffectSchemas.Number.U32),
    },
    {
        identifier: "TypesPluginConfigUser",
        title: "types.PluginConfigUser",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigUser",
    }
) {}
