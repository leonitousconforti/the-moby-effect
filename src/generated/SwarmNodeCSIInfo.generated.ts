import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmTopology from "./SwarmTopology.generated.js";

export class SwarmNodeCSIInfo extends Schema.Class<SwarmNodeCSIInfo>("SwarmNodeCSIInfo")(
    {
        PluginName: Schema.optional(Schema.String),
        NodeID: Schema.optional(Schema.String),
        MaxVolumesPerNode: Schema.optional(MobySchemas.Int64),
        AccessibleTopology: Schema.optionalWith(SwarmTopology.SwarmTopology, { nullable: true }),
    },
    {
        identifier: "SwarmNodeCSIInfo",
        title: "swarm.NodeCSIInfo",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L72-L85",
    }
) {}
