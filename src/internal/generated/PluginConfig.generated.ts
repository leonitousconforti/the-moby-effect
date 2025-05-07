import * as Schema from "effect/Schema";
import * as PluginConfigArgs from "./PluginConfigArgs.generated.js";
import * as PluginConfigInterface from "./PluginConfigInterface.generated.js";
import * as PluginConfigLinux from "./PluginConfigLinux.generated.js";
import * as PluginConfigNetwork from "./PluginConfigNetwork.generated.js";
import * as PluginConfigRootfs from "./PluginConfigRootfs.generated.js";
import * as PluginConfigUser from "./PluginConfigUser.generated.js";
import * as PluginEnv from "./PluginEnv.generated.js";
import * as PluginMount from "./PluginMount.generated.js";

export class PluginConfig extends Schema.Class<PluginConfig>("PluginConfig")(
    {
        Args: Schema.NullOr(PluginConfigArgs.PluginConfigArgs),
        Description: Schema.String,
        DockerVersion: Schema.optional(Schema.String),
        Documentation: Schema.String,
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        Env: Schema.NullOr(Schema.Array(Schema.NullOr(PluginEnv.PluginEnv))),
        Interface: Schema.NullOr(PluginConfigInterface.PluginConfigInterface),
        IpcHost: Schema.Boolean,
        Linux: Schema.NullOr(PluginConfigLinux.PluginConfigLinux),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(PluginMount.PluginMount))),
        Network: Schema.NullOr(PluginConfigNetwork.PluginConfigNetwork),
        PidHost: Schema.Boolean,
        PropagatedMount: Schema.String,
        User: Schema.optionalWith(PluginConfigUser.PluginConfigUser, { nullable: true }),
        WorkDir: Schema.String,
        rootfs: Schema.optionalWith(PluginConfigRootfs.PluginConfigRootfs, { nullable: true }),
    },
    {
        identifier: "PluginConfig",
        title: "types.PluginConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/plugin.go#L33-L97",
    }
) {}
