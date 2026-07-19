import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmTopology from "./SwarmTopology.generated.ts";

export class SwarmNodeCSIInfo extends Schema.Class<SwarmNodeCSIInfo>("SwarmNodeCSIInfo")(
    {
        PluginName: Schema.optional(Schema.String),
        NodeID: Schema.optional(MobyIdentifiers.NodeIdentifier),
        MaxVolumesPerNode: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        AccessibleTopology: Schema.optional(Schema.NullOr(SwarmTopology.SwarmTopology)),
    },
    {
        identifier: "SwarmNodeCSIInfo",
        title: "swarm.NodeCSIInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeCSIInfo",
    }
) {}
