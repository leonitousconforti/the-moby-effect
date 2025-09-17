import * as Schema from "effect/Schema";

export class SwarmPeer extends Schema.Class<SwarmPeer>("SwarmPeer")(
    {
        NodeID: Schema.String,
        Addr: Schema.String,
    },
    {
        identifier: "SwarmPeer",
        title: "swarm.Peer",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Peer",
    }
) {}
