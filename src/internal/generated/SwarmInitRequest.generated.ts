import * as Schema from "effect/Schema";
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
        Availability: Schema.Literal("active", "pause", "drain"),
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmInitRequest",
        title: "swarm.InitRequest",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#InitRequest",
    }
) {}
