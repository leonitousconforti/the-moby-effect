import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginConfig extends Schema.Class<PluginConfig>("PluginConfig")(
    {
        Args: MobySchemasGenerated.PluginConfigArgs,
        Description: Schema.String,
        DockerVersion: Schema.optional(Schema.String),
        Documentation: Schema.String,
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        Env: Schema.NullOr(Schema.Array(MobySchemasGenerated.PluginEnv)),
        Interface: MobySchemasGenerated.PluginConfigInterface,
        IpcHost: Schema.Boolean,
        Linux: MobySchemasGenerated.PluginConfigLinux,
        Mounts: Schema.NullOr(Schema.Array(MobySchemasGenerated.PluginMount)),
        Network: MobySchemasGenerated.PluginConfigNetwork,
        PidHost: Schema.Boolean,
        PropagatedMount: Schema.String,
        User: Schema.optional(MobySchemasGenerated.PluginConfigUser),
        WorkDir: Schema.String,
        rootfs: Schema.optional(MobySchemasGenerated.PluginConfigRootfs, { nullable: true }),
    },
    {
        identifier: "PluginConfig",
        title: "types.PluginConfig",
    }
) {}
