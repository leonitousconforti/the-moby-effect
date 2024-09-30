import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/plugin.go#L33-L97",
    }
) {}
