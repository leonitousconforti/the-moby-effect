import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSummary extends Schema.Class<NetworkSummary>("NetworkSummary")(
    {
        Name: Schema.String,
        Id: Schema.String,
        Created: Schema.NullOr(MobySchemasGenerated.Time),
        Scope: Schema.String,
        Driver: Schema.String,
        EnableIPv6: Schema.Boolean,
        IPAM: Schema.NullOr(MobySchemasGenerated.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigFrom: Schema.NullOr(MobySchemasGenerated.NetworkConfigReference),
        ConfigOnly: Schema.Boolean,
        Containers: Schema.NullOr(
            Schema.Record(Schema.String, Schema.NullOr(MobySchemasGenerated.NetworkEndpointResource))
        ),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Peers: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.NetworkPeerInfo)), { nullable: true }),
        Services: Schema.optional(
            Schema.Record(Schema.String, Schema.NullOr(MobySchemasGenerated.NetworkServiceInfo)),
            { nullable: true }
        ),
    },
    {
        identifier: "NetworkSummary",
        title: "network.Inspect",
    }
) {}
