import * as Schema from "@effect/schema/Schema";

export class NetworkEndpointIPAMConfig extends Schema.Class<NetworkEndpointIPAMConfig>("NetworkEndpointIPAMConfig")(
    {
        IPv4Address: Schema.optional(Schema.String),
        IPv6Address: Schema.optional(Schema.String),
        LinkLocalIPs: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "NetworkEndpointIPAMConfig",
        title: "network.EndpointIPAMConfig",
    }
) {}
