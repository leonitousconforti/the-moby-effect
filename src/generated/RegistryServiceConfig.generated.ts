import * as Schema from "@effect/schema/Schema";
import * as NetIPNet from "./NetIPNet.generated.js";
import * as RegistryIndexInfo from "./RegistryIndexInfo.generated.js";

export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>("RegistryServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.NullOr(Schema.Array(Schema.NullOr(NetIPNet.NetIPNet))),
        AllowNondistributableArtifactsHostnames: Schema.NullOr(Schema.Array(Schema.String)),
        InsecureRegistryCIDRs: Schema.NullOr(Schema.Array(Schema.NullOr(NetIPNet.NetIPNet))),
        IndexConfigs: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.NullOr(RegistryIndexInfo.RegistryIndexInfo),
            })
        ),
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "RegistryServiceConfig",
        title: "registry.ServiceConfig",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/registry.go#L10-L17",
    }
) {}
