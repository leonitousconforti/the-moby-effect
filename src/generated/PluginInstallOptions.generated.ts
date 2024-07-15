import * as Schema from "@effect/schema/Schema";

export class PluginInstallOptions extends Schema.Class<PluginInstallOptions>("PluginInstallOptions")(
    {
        Disabled: Schema.NullOr(Schema.Boolean),
        AcceptAllPermissions: Schema.NullOr(Schema.Boolean),
        RegistryAuth: Schema.NullOr(Schema.String),
        RemoteRef: Schema.NullOr(Schema.String),
        Args: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginInstallOptions",
        title: "types.PluginInstallOptions",
    }
) {}
