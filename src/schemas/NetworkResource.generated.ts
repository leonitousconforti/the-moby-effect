import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkResource extends Schema.Class<NetworkResource>("NetworkResource")({
    Name: Schema.String,
    ID: Schema.String,
    Created: MobySchemas.Time,
    Scope: Schema.String,
    Driver: Schema.String,
    EnableIPv6: Schema.Boolean,
    IPAM: MobySchemas.IPAM,
    Internal: Schema.Boolean,
    Attachable: Schema.Boolean,
    Ingress: Schema.Boolean,
    ConfigFrom: MobySchemas.ConfigReference,
    ConfigOnly: Schema.Boolean,
    Containers: Schema.Record(Schema.String, MobySchemas.EndpointResource),
    Options: Schema.Record(Schema.String, Schema.String),
    Labels: Schema.Record(Schema.String, Schema.String),
    Peers: Schema.Array(MobySchemas.PeerInfo),
    Services: Schema.Record(Schema.String, MobySchemas.ServiceInfo),
}) {}
