import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L7-L18",
    }
) {}
