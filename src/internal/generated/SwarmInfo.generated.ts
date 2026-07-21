import * as Schema from "effect/Schema";

import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmClusterInfo from "./SwarmClusterInfo.generated.ts";
import * as SwarmPeer from "./SwarmPeer.generated.ts";

export class SwarmInfo extends Schema.Class<SwarmInfo>("SwarmInfo")(
    {
        NodeID: MobyIdentifiers.NodeIdentifier,
        NodeAddr: Schema.String,
        LocalNodeState: Schema.Literals(["inactive", "pending", "active", "error", "locked"]),
        ControlAvailable: Schema.Boolean,
        Error: Schema.String,
        RemoteManagers: Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPeer.SwarmPeer))),
        Nodes: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        Managers: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        Cluster: Schema.optional(Schema.NullOr(SwarmClusterInfo.SwarmClusterInfo)),
        Warnings: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "SwarmInfo",
        title: "swarm.Info",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Info",
    }
) {}
