import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ServiceConfig extends Schema.Class<ServiceConfig>("ServiceConfig")(
    {
        AllowNondistributableArtifactsCIDRs: Schema.Array(MobySchemasGenerated.NetIPNet),
        AllowNondistributableArtifactsHostnames: Schema.Array(Schema.String),
        InsecureRegistryCIDRs: Schema.Array(MobySchemasGenerated.NetIPNet),
        IndexConfigs: Schema.Record(Schema.String, MobySchemasGenerated.IndexInfo),
        Mirrors: Schema.Array(Schema.String),
    },
    {
        identifier: "ServiceConfig",
        title: "registry.ServiceConfig",
    }
) {}
