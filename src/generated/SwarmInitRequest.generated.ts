import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmSpec from "./SwarmSpec.generated.js";

export class SwarmInitRequest extends Schema.Class<SwarmInitRequest>("SwarmInitRequest")(
    {
        ListenAddr: Schema.String,
        AdvertiseAddr: Schema.String,
        DataPathAddr: Schema.String,
        DataPathPort: MobySchemas.UInt32,
        ForceNewCluster: Schema.Boolean,
        Spec: Schema.NullOr(SwarmSpec.SwarmSpec),
        AutoLockManagers: Schema.Boolean,
        Availability: Schema.String,
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmInitRequest",
        title: "swarm.InitRequest",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L152-L164",
    }
) {}
