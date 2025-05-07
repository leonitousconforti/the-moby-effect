import * as Schema from "effect/Schema";
import * as RegistryIndexInfo from "./RegistryIndexInfo.generated.js";

export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>("RegistryServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.optionalWith(Schema.Array(Schema.NullOr(Schema.String)), {
            nullable: true,
        }),
        AllowNondistributableArtifactsHostnames: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        InsecureRegistryCIDRs: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
        IndexConfigs: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(RegistryIndexInfo.RegistryIndexInfo) })
        ),
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "RegistryServiceConfig",
        title: "registry.ServiceConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/registry/registry.go#L10-L17",
    }
) {}
