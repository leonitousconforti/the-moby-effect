import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkResource extends Schema.Class<NetworkResource>("NetworkResource")(
    {
        Name: Schema.NullOr(Schema.String),
        Id: Schema.NullOr(Schema.String),
        Created: MobySchemasGenerated.Time,
        Scope: Schema.NullOr(Schema.String),
        Driver: Schema.NullOr(Schema.String),
        EnableIPv6: Schema.NullOr(Schema.Boolean),
        IPAM: MobySchemasGenerated.IPAM,
        Internal: Schema.NullOr(Schema.Boolean),
        Attachable: Schema.NullOr(Schema.Boolean),
        Ingress: Schema.NullOr(Schema.Boolean),
        ConfigFrom: MobySchemasGenerated.ConfigReference,
        ConfigOnly: Schema.NullOr(Schema.Boolean),
        Containers: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.EndpointResource)),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Peers: Schema.optional(Schema.Array(MobySchemasGenerated.PeerInfo), { nullable: true }),
        Services: Schema.optional(Schema.Record(Schema.String, MobySchemasGenerated.ServiceInfo), { nullable: true }),
    },
    {
        identifier: "NetworkResource",
        title: "types.NetworkResource",
    }
) {}
