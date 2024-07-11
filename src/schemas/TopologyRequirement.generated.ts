import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TopologyRequirement extends Schema.Class<TopologyRequirement>("TopologyRequirement")({
    Requisite: Schema.Array(MobySchemas.Topology),
    Preferred: Schema.Array(MobySchemas.Topology),
}) {}
