import * as Schema from "effect/Schema";
import * as TypesPluginDevice from "./TypesPluginDevice.generated.js";
import * as TypesPluginMount from "./TypesPluginMount.generated.js";

export class TypesPluginSettings extends Schema.Class<TypesPluginSettings>("TypesPluginSettings")(
    {
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(TypesPluginDevice.TypesPluginDevice))),
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(TypesPluginMount.TypesPluginMount))),
    },
    {
        identifier: "TypesPluginSettings",
        title: "types.PluginSettings",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginSettings",
    }
) {}
