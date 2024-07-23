import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkEndpointIPAMConfig extends Schema.Class<NetworkEndpointIPAMConfig>("NetworkEndpointIPAMConfig")(
    {
        IPv4Address: Schema.optional(MobySchemas.IPv4),
        IPv6Address: Schema.optional(MobySchemas.IPv6),
        LinkLocalIPs: Schema.optional(Schema.Array(MobySchemas.Address), { nullable: true }),
    },
    {
        identifier: "NetworkEndpointIPAMConfig",
        title: "network.EndpointIPAMConfig",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/network/endpoint.go#L61-L66",
    }
) {}
