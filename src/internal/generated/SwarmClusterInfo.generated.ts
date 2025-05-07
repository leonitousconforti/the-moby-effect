import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as SwarmSpec from "./SwarmSpec.generated.js";
import * as SwarmTLSInfo from "./SwarmTLSInfo.generated.js";

export class SwarmClusterInfo extends Schema.Class<SwarmClusterInfo>("SwarmClusterInfo")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(SwarmSpec.SwarmSpec),
        TLSInfo: Schema.NullOr(SwarmTLSInfo.SwarmTLSInfo),
        RootRotationInProgress: Schema.Boolean,
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: MobySchemas.UInt32,
        DataPathPort: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmClusterInfo",
        title: "swarm.ClusterInfo",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L7-L18",
    }
) {}
