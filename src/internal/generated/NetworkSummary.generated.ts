import * as Schema from "effect/Schema";
import * as NetworkConfigReference from "./NetworkConfigReference.generated.js";
import * as NetworkEndpointResource from "./NetworkEndpointResource.generated.js";
import * as NetworkIPAM from "./NetworkIPAM.generated.js";
import * as NetworkPeerInfo from "./NetworkPeerInfo.generated.js";
import * as NetworkServiceInfo from "./NetworkServiceInfo.generated.js";

export class NetworkSummary extends Schema.Class<NetworkSummary>("NetworkSummary")(
    {
        Name: Schema.String,
        Id: Schema.String,
        Created: Schema.NullOr(Schema.DateFromString),
        Scope: Schema.String,
        Driver: Schema.String,
        EnableIPv6: Schema.Boolean,
        IPAM: Schema.NullOr(NetworkIPAM.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigFrom: Schema.NullOr(NetworkConfigReference.NetworkConfigReference),
        ConfigOnly: Schema.Boolean,
        Containers: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.NullOr(NetworkEndpointResource.NetworkEndpointResource),
            })
        ),
        Options: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Peers: Schema.optionalWith(Schema.Array(Schema.NullOr(NetworkPeerInfo.NetworkPeerInfo)), {
            nullable: true,
        }),
        Services: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.NullOr(NetworkServiceInfo.NetworkServiceInfo),
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "NetworkSummary",
        title: "network.Inspect",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L72-L91",
    }
) {}
