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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L198-L214",
    }
) {}
