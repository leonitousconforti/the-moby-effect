import * as Schema from "effect/Schema";

import * as MobyIdentifiers from "../schemas/id.ts";

export class SwarmPeer extends Schema.Class<SwarmPeer>("SwarmPeer")(
    {
        NodeID: MobyIdentifiers.NodeIdentifier,
        Addr: Schema.String,
    },
    {
        identifier: "SwarmPeer",
        title: "swarm.Peer",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Peer",
    }
) {}
