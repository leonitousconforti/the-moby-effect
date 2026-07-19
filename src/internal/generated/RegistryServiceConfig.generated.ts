import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as RegistryIndexInfo from "./RegistryIndexInfo.generated.ts";

export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>("RegistryServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(EffectSchemas.Internet.CidrBlockFromString)))),
        AllowNondistributableArtifactsHostnames: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        InsecureRegistryCIDRs: Schema.NullOr(Schema.Array(Schema.NullOr(EffectSchemas.Internet.CidrBlockFromString))),
        IndexConfigs: Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(RegistryIndexInfo.RegistryIndexInfo))),
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "RegistryServiceConfig",
        title: "registry.ServiceConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#ServiceConfig",
    }
) {}
