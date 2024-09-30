import * as Schema from "@effect/schema/Schema";

export class SwarmPeer extends Schema.Class<SwarmPeer>("SwarmPeer")(
    {
        NodeID: Schema.String,
        Addr: Schema.String,
    },
    {
        identifier: "SwarmPeer",
        title: "swarm.Peer",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L226-L230",
    }
) {}
