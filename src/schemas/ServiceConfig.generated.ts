import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ServiceConfig extends Schema.Class<ServiceConfig>("ServiceConfig")({
    AllowNondistributableArtifactsCIDRs: Schema.Array(MobySchemas.NetIPNet),
    AllowNondistributableArtifactsHostnames: Schema.Array(Schema.String),
    InsecureRegistryCIDRs: Schema.Array(MobySchemas.NetIPNet),
    IndexConfigs: Schema.Record(Schema.String, MobySchemas.IndexInfo),
    Mirrors: Schema.Array(Schema.String),
}) {}
