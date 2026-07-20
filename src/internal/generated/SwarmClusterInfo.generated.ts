import * as Schema from "effect/Schema";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as SwarmSpec from "./SwarmSpec.generated.ts";
import * as SwarmTLSInfo from "./SwarmTLSInfo.generated.ts";

export class SwarmClusterInfo extends Schema.Class<SwarmClusterInfo>("SwarmClusterInfo")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(SwarmSpec.SwarmSpec),
        TLSInfo: Schema.NullOr(SwarmTLSInfo.SwarmTLSInfo),
        RootRotationInProgress: Schema.Boolean,
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })),
        DataPathPort: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })),
    },
    {
        identifier: "SwarmClusterInfo",
        title: "swarm.ClusterInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ClusterInfo",
    }
) {}
