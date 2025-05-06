import * as Schema from "effect/Schema";
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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L72-L85",
    }
) {}
