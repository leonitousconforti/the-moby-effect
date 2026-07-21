import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as NetworkConfigReference from "./NetworkConfigReference.generated.ts";
import * as NetworkEndpointResource from "./NetworkEndpointResource.generated.ts";
import * as NetworkIPAM from "./NetworkIPAM.generated.ts";
import * as NetworkPeerInfo from "./NetworkPeerInfo.generated.ts";
import * as NetworkServiceInfo from "./NetworkServiceInfo.generated.ts";

export class NetworkInspect extends Schema.Class<NetworkInspect>("NetworkInspect")(
    {
        Name: Schema.String,
        Id: MobyIdentifiers.NetworkIdentifier,
        Created: Schema.NullOr(Schema.DateFromString),
        Scope: Schema.String,
        Driver: Schema.String,
        EnableIPv4: Schema.Boolean,
        EnableIPv6: Schema.Boolean,
        IPAM: Schema.NullOr(NetworkIPAM.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigFrom: Schema.NullOr(NetworkConfigReference.NetworkConfigReference),
        ConfigOnly: Schema.Boolean,
        Containers: Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(NetworkEndpointResource.NetworkEndpointResource))),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Peers: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(NetworkPeerInfo.NetworkPeerInfo)))),
        Services: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(NetworkServiceInfo.NetworkServiceInfo)))),
    },
    {
        identifier: "NetworkInspect",
        title: "network.Inspect",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#Inspect",
    }
) {}
