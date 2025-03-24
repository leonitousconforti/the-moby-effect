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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L104-L108",
    }
) {}
