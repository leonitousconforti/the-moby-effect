import * as Schema from "effect/Schema";

export class NetworkEndpointIPAMConfig extends Schema.Class<NetworkEndpointIPAMConfig>("NetworkEndpointIPAMConfig")(
    {
        IPv4Address: Schema.optional(Schema.String),
        IPv6Address: Schema.optional(Schema.String),
        LinkLocalIPs: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "NetworkEndpointIPAMConfig",
        title: "network.EndpointIPAMConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#EndpointIPAMConfig",
    }
) {}
