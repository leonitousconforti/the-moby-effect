import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginConfig extends Schema.Class<PluginConfig>("PluginConfig")(
    {
        Args: MobySchemasGenerated.PluginConfigArgs,
        Description: Schema.NullOr(Schema.String),
        DockerVersion: Schema.optional(Schema.String, { nullable: true }),
        Documentation: Schema.NullOr(Schema.String),
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        Env: Schema.NullOr(Schema.Array(MobySchemasGenerated.PluginEnv)),
        Interface: MobySchemasGenerated.PluginConfigInterface,
        IpcHost: Schema.NullOr(Schema.Boolean),
        Linux: MobySchemasGenerated.PluginConfigLinux,
        Mounts: Schema.NullOr(Schema.Array(MobySchemasGenerated.PluginMount)),
        Network: MobySchemasGenerated.PluginConfigNetwork,
        PidHost: Schema.NullOr(Schema.Boolean),
        PropagatedMount: Schema.NullOr(Schema.String),
        User: Schema.optional(MobySchemasGenerated.PluginConfigUser),
        WorkDir: Schema.NullOr(Schema.String),
        rootfs: Schema.optional(MobySchemasGenerated.PluginConfigRootfs, { nullable: true }),
    },
    {
        identifier: "PluginConfig",
        title: "types.PluginConfig",
    }
) {}
