import * as Schema from "effect/Schema";

export class SwarmPeer extends Schema.Class<SwarmPeer>("SwarmPeer")(
    {
        NodeID: Schema.String,
        Addr: Schema.String,
    },
    {
        identifier: "SwarmPeer",
        title: "swarm.Peer",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L226-L230",
    }
) {}
