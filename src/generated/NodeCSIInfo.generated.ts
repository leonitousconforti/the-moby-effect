import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NodeCSIInfo extends Schema.Class<NodeCSIInfo>("NodeCSIInfo")(
    {
        PluginName: Schema.optional(Schema.String, { nullable: true }),
        NodeID: Schema.optional(Schema.String, { nullable: true }),
        MaxVolumesPerNode: Schema.optional(MobySchemas.Int64, { nullable: true }),
        AccessibleTopology: Schema.optional(MobySchemasGenerated.Topology, { nullable: true }),
    },
    {
        identifier: "NodeCSIInfo",
        title: "swarm.NodeCSIInfo",
    }
) {}
