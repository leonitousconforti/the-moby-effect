import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkEndpointIPAMConfig extends Schema.Class<NetworkEndpointIPAMConfig>("NetworkEndpointIPAMConfig")(
    {
        IPv4Address: Schema.optional(MobySchemas.IPv4),
        IPv6Address: Schema.optional(MobySchemas.IPv6),
        LinkLocalIPs: Schema.optionalWith(Schema.Array(MobySchemas.Address), { nullable: true }),
    },
    {
        identifier: "NetworkEndpointIPAMConfig",
        title: "network.EndpointIPAMConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/endpoint.go#L67-L72",
    }
) {}
