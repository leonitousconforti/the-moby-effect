import * as Schema from "@effect/schema/Schema";

export class NetworkPeerInfo extends Schema.Class<NetworkPeerInfo>("NetworkPeerInfo")(
    {
        Name: Schema.String,
        IP: Schema.String,
    },
    {
        identifier: "NetworkPeerInfo",
        title: "network.PeerInfo",
    }
) {}
