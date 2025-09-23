import * as Schema from "effect/Schema";
import * as RegistryIndexInfo from "./RegistryIndexInfo.generated.js";
import * as RegistryNetIPNet from "./RegistryNetIPNet.generated.js";

export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>("RegistryServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.optionalWith(
            Schema.Array(Schema.NullOr(RegistryNetIPNet.RegistryNetIPNet)),
            { nullable: true }
        ),
        AllowNondistributableArtifactsHostnames: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        InsecureRegistryCIDRs: Schema.NullOr(Schema.Array(Schema.NullOr(RegistryNetIPNet.RegistryNetIPNet))),
        IndexConfigs: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(RegistryIndexInfo.RegistryIndexInfo) })
        ),
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "RegistryServiceConfig",
        title: "registry.ServiceConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#ServiceConfig",
    }
) {}
