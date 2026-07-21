import * as Schema from "effect/Schema";

import * as TypesPluginConfigArgs from "./TypesPluginConfigArgs.generated.ts";
import * as TypesPluginConfigInterface from "./TypesPluginConfigInterface.generated.ts";
import * as TypesPluginConfigLinux from "./TypesPluginConfigLinux.generated.ts";
import * as TypesPluginConfigNetwork from "./TypesPluginConfigNetwork.generated.ts";
import * as TypesPluginConfigRootfs from "./TypesPluginConfigRootfs.generated.ts";
import * as TypesPluginConfigUser from "./TypesPluginConfigUser.generated.ts";
import * as TypesPluginEnv from "./TypesPluginEnv.generated.ts";
import * as TypesPluginMount from "./TypesPluginMount.generated.ts";

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
        User: Schema.optional(Schema.NullOr(TypesPluginConfigUser.TypesPluginConfigUser)),
        WorkDir: Schema.String,
        rootfs: Schema.optional(Schema.NullOr(TypesPluginConfigRootfs.TypesPluginConfigRootfs)),
    },
    {
        identifier: "TypesPluginConfig",
        title: "types.PluginConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfig",
    }
) {}
