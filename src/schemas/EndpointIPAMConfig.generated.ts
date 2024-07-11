import * as Schema from "@effect/schema/Schema";

export class EndpointIPAMConfig extends Schema.Class<EndpointIPAMConfig>("EndpointIPAMConfig")({
    IPv4Address: Schema.String,
    IPv6Address: Schema.String,
    LinkLocalIPs: Schema.Array(Schema.String),
}) {}
