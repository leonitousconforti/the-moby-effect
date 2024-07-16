import * as Schema from "@effect/schema/Schema";

export class SwarmPeer extends Schema.Class<SwarmPeer>("SwarmPeer")(
    {
        NodeID: Schema.String,
        Addr: Schema.String,
    },
    {
        identifier: "SwarmPeer",
        title: "swarm.Peer",
    }
) {}
