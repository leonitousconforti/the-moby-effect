import * as Schema from "effect/Schema";

export class NetworkPeerInfo extends Schema.Class<NetworkPeerInfo>("NetworkPeerInfo")(
    {
        Name: Schema.String,
        IP: Schema.String,
    },
    {
        identifier: "NetworkPeerInfo",
        title: "network.PeerInfo",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L106-L110",
    }
) {}
