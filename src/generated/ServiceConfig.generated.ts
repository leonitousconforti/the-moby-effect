import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ServiceConfig extends Schema.Class<ServiceConfig>("ServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.NullOr(Schema.Array(MobySchemasGenerated.NetIPNet)),
        AllowNondistributableArtifactsHostnames: Schema.NullOr(Schema.Array(Schema.String)),
        InsecureRegistryCIDRs: Schema.NullOr(Schema.Array(MobySchemasGenerated.NetIPNet)),
        IndexConfigs: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.IndexInfo)),
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ServiceConfig",
        title: "registry.ServiceConfig",
    }
) {}
