import * as Schema from "effect/Schema";

export class NetworkPeerInfo extends Schema.Class<NetworkPeerInfo>("NetworkPeerInfo")(
    {
        Name: Schema.String,
        IP: Schema.String,
    },
    {
        identifier: "NetworkPeerInfo",
        title: "network.PeerInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#PeerInfo",
    }
) {}
