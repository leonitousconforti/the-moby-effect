import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmClusterInfo from "./SwarmClusterInfo.generated.js";
import * as SwarmPeer from "./SwarmPeer.generated.js";

export class SwarmInfo extends Schema.Class<SwarmInfo>("SwarmInfo")(
    {
        NodeID: Schema.String,
        NodeAddr: Schema.String,
        LocalNodeState: Schema.Literal("inactive", "pending", "active", "error", "locked"),
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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Info",
    }
) {}
