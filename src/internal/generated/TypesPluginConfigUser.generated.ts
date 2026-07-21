import * as Schema from "effect/Schema";

export class TypesPluginConfigUser extends Schema.Class<TypesPluginConfigUser>("TypesPluginConfigUser")(
    {
        GID: Schema.optional(
            Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))
        ),
        UID: Schema.optional(
            Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))
        ),
    },
    {
        identifier: "TypesPluginConfigUser",
        title: "types.PluginConfigUser",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigUser",
    }
) {}
