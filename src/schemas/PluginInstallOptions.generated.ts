import * as Schema from "@effect/schema/Schema";

export class PluginInstallOptions extends Schema.Class<PluginInstallOptions>("PluginInstallOptions")({
    Disabled: Schema.Boolean,
    AcceptAllPermissions: Schema.Boolean,
    RegistryAuth: Schema.String,
    RemoteRef: Schema.String,
    Args: Schema.Array(Schema.String),
}) {}
