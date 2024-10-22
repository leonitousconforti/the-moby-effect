import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmClusterInfo from "./SwarmClusterInfo.generated.js";
import * as SwarmPeer from "./SwarmPeer.generated.js";

export class SwarmInfo extends Schema.Class<SwarmInfo>("SwarmInfo")(
    {
        NodeID: Schema.String,
        NodeAddr: Schema.String,
        LocalNodeState: Schema.String,
        ControlAvailable: Schema.Boolean,
        Error: Schema.String,
        RemoteManagers: Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPeer.SwarmPeer))),
        Nodes: Schema.optional(MobySchemas.Int64),
        Managers: Schema.optional(MobySchemas.Int64),
        Cluster: Schema.optionalWith(SwarmClusterInfo.SwarmClusterInfo, { nullable: true }),
        Warnings: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmInfo",
        title: "swarm.Info",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L198-L214",
    }
) {}
