import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSummary extends Schema.Class<NetworkSummary>("NetworkSummary")(
    {
        Name: Schema.String,
        Id: Schema.String,
        Created: MobySchemasGenerated.Time,
        Scope: Schema.String,
        Driver: Schema.String,
        EnableIPv6: Schema.Boolean,
        IPAM: MobySchemasGenerated.NetworkIPAM,
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigFrom: MobySchemasGenerated.NetworkConfigReference,
        ConfigOnly: Schema.Boolean,
        Containers: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.NetworkEndpointResource)),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Peers: Schema.optional(Schema.Array(MobySchemasGenerated.NetworkPeerInfo), { nullable: true }),
        Services: Schema.optional(Schema.Record(Schema.String, MobySchemasGenerated.NetworkServiceInfo), {
            nullable: true,
        }),
    },
    {
        identifier: "NetworkSummary",
        title: "network.Inspect",
    }
) {}