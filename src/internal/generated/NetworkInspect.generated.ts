import * as Schema from "effect/Schema";
import * as NetworkConfigReference from "./NetworkConfigReference.generated.js";
import * as NetworkEndpointResource from "./NetworkEndpointResource.generated.js";
import * as NetworkIPAM from "./NetworkIPAM.generated.js";
import * as NetworkPeerInfo from "./NetworkPeerInfo.generated.js";
import * as NetworkServiceInfo from "./NetworkServiceInfo.generated.js";

export class NetworkInspect extends Schema.Class<NetworkInspect>("NetworkInspect")(
    {
        Name: Schema.String,
        Id: Schema.String,
        Created: Schema.NullOr(Schema.DateFromString),
        Scope: Schema.String,
        Driver: Schema.String,
        EnableIPv4: Schema.optional(Schema.Boolean), // optional for docker.io/library/docker:27-dind-rootless
        EnableIPv6: Schema.Boolean,
        IPAM: Schema.NullOr(NetworkIPAM.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigFrom: Schema.NullOr(NetworkConfigReference.NetworkConfigReference),
        ConfigOnly: Schema.Boolean,
        Containers: Schema.NullishOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointResource.NetworkEndpointResource) }) // optional for docker.io/library/docker:26-dind-rootless
        ),
        Options: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Peers: Schema.optionalWith(Schema.Array(Schema.NullOr(NetworkPeerInfo.NetworkPeerInfo)), { nullable: true }),
        Services: Schema.optionalWith(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkServiceInfo.NetworkServiceInfo) }),
            { nullable: true }
        ),
    },
    {
        identifier: "NetworkInspect",
        title: "network.Inspect",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#Inspect",
    }
) {}
