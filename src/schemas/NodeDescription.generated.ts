import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NodeDescription extends Schema.Class<NodeDescription>("NodeDescription")({
    Hostname: Schema.String,
    Platform: MobySchemas.Platform,
    Resources: MobySchemas.Resources,
    Engine: MobySchemas.EngineDescription,
    TLSInfo: MobySchemas.TLSInfo,
    CSIInfo: Schema.Array(MobySchemas.NodeCSIInfo),
}) {}
