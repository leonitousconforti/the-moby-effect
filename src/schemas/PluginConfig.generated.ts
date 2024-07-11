import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PluginConfig extends Schema.Class<PluginConfig>("PluginConfig")({
    Args: MobySchemas.PluginConfigArgs,
    Description: Schema.String,
    DockerVersion: Schema.String,
    Documentation: Schema.String,
    Entrypoint: Schema.Array(Schema.String),
    Env: Schema.Array(MobySchemas.PluginEnv),
    Interface: MobySchemas.PluginConfigInterface,
    IpcHost: Schema.Boolean,
    Linux: MobySchemas.PluginConfigLinux,
    Mounts: Schema.Array(MobySchemas.PluginMount),
    Network: MobySchemas.PluginConfigNetwork,
    PidHost: Schema.Boolean,
    PropagatedMount: Schema.String,
    User: MobySchemas.PluginConfigUser,
    WorkDir: Schema.String,
    Rootfs: MobySchemas.PluginConfigRootfs,
}) {}
