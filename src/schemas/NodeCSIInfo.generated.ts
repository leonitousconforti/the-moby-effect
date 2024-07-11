import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NodeCSIInfo extends Schema.Class<NodeCSIInfo>("NodeCSIInfo")({
    PluginName: Schema.String,
    NodeID: Schema.String,
    MaxVolumesPerNode: MobySchemas.Int64,
    AccessibleTopology: MobySchemas.Topology,
}) {}
