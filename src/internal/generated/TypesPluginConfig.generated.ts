import * as Schema from "effect/Schema";
import * as TypesPluginConfigArgs from "./TypesPluginConfigArgs.generated.js";
import * as TypesPluginConfigInterface from "./TypesPluginConfigInterface.generated.js";
import * as TypesPluginConfigLinux from "./TypesPluginConfigLinux.generated.js";
import * as TypesPluginConfigNetwork from "./TypesPluginConfigNetwork.generated.js";
import * as TypesPluginConfigRootfs from "./TypesPluginConfigRootfs.generated.js";
import * as TypesPluginConfigUser from "./TypesPluginConfigUser.generated.js";
import * as TypesPluginEnv from "./TypesPluginEnv.generated.js";
import * as TypesPluginMount from "./TypesPluginMount.generated.js";

export class TypesPluginConfig extends Schema.Class<TypesPluginConfig>("TypesPluginConfig")(
    {
        Args: Schema.NullOr(TypesPluginConfigArgs.TypesPluginConfigArgs),
        Description: Schema.String,
        DockerVersion: Schema.optional(Schema.String),
        Documentation: Schema.String,
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        Env: Schema.NullOr(Schema.Array(Schema.NullOr(TypesPluginEnv.TypesPluginEnv))),
        Interface: Schema.NullOr(TypesPluginConfigInterface.TypesPluginConfigInterface),
        IpcHost: Schema.Boolean,
        Linux: Schema.NullOr(TypesPluginConfigLinux.TypesPluginConfigLinux),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(TypesPluginMount.TypesPluginMount))),
        Network: Schema.NullOr(TypesPluginConfigNetwork.TypesPluginConfigNetwork),
        PidHost: Schema.Boolean,
        PropagatedMount: Schema.String,
        User: Schema.optionalWith(TypesPluginConfigUser.TypesPluginConfigUser, { nullable: true }),
        WorkDir: Schema.String,
        rootfs: Schema.optionalWith(TypesPluginConfigRootfs.TypesPluginConfigRootfs, { nullable: true }),
    },
    {
        identifier: "TypesPluginConfig",
        title: "types.PluginConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfig",
    }
) {}
