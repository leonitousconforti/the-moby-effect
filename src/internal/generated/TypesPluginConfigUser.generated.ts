import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class TypesPluginConfigUser extends Schema.Class<TypesPluginConfigUser>("TypesPluginConfigUser")(
    {
        GID: Schema.optional(
            MobyNumber.NumberFromWireString.check(
                Schema.isInt(),
                Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })
            )
        ),
        UID: Schema.optional(
            MobyNumber.NumberFromWireString.check(
                Schema.isInt(),
                Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })
            )
        ),
    },
    {
        identifier: "TypesPluginConfigUser",
        title: "types.PluginConfigUser",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigUser",
    }
) {}
