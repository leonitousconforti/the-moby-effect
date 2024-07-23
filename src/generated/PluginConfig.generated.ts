import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginConfig extends Schema.Class<PluginConfig>("PluginConfig")(
    {
        Args: Schema.NullOr(MobySchemasGenerated.PluginConfigArgs),
        Description: Schema.String,
        DockerVersion: Schema.optional(Schema.String),
        Documentation: Schema.String,
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        Env: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.PluginEnv))),
        Interface: Schema.NullOr(MobySchemasGenerated.PluginConfigInterface),
        IpcHost: Schema.Boolean,
        Linux: Schema.NullOr(MobySchemasGenerated.PluginConfigLinux),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.PluginMount))),
        Network: Schema.NullOr(MobySchemasGenerated.PluginConfigNetwork),
        PidHost: Schema.Boolean,
        PropagatedMount: Schema.String,
        User: Schema.optional(MobySchemasGenerated.PluginConfigUser, { nullable: true }),
        WorkDir: Schema.String,
        rootfs: Schema.optional(MobySchemasGenerated.PluginConfigRootfs, { nullable: true }),
    },
    {
        identifier: "PluginConfig",
        title: "types.PluginConfig",
    }
) {}
