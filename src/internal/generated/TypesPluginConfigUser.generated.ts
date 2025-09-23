import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class TypesPluginConfigUser extends Schema.Class<TypesPluginConfigUser>("TypesPluginConfigUser")(
    {
        GID: Schema.optional(MobySchemas.UInt32),
        UID: Schema.optional(MobySchemas.UInt32),
    },
    {
        identifier: "TypesPluginConfigUser",
        title: "types.PluginConfigUser",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigUser",
    }
) {}
