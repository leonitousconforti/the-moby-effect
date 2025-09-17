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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeCSIInfo",
    }
) {}
