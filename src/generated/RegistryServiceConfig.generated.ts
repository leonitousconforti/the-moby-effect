import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>("RegistryServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.NullOr(Schema.Array(MobySchemasGenerated.NetIPNet)),
        AllowNondistributableArtifactsHostnames: Schema.NullOr(Schema.Array(Schema.String)),
        InsecureRegistryCIDRs: Schema.NullOr(Schema.Array(MobySchemasGenerated.NetIPNet)),
        IndexConfigs: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.RegistryIndexInfo)),
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "RegistryServiceConfig",
        title: "registry.ServiceConfig",
    }
) {}
