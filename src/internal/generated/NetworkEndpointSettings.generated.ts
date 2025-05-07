import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as NetworkEndpointIPAMConfig from "./NetworkEndpointIPAMConfig.generated.js";

export class NetworkEndpointSettings extends Schema.Class<NetworkEndpointSettings>("NetworkEndpointSettings")(
    {
        IPAMConfig: Schema.NullOr(NetworkEndpointIPAMConfig.NetworkEndpointIPAMConfig),
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        Aliases: Schema.NullOr(Schema.Array(Schema.String)),
        MacAddress: Schema.Union(Schema.Literal(""), MobySchemas.MacAddress),
        DriverOpts: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        GwPriority: MobySchemas.Int64,
        NetworkID: Schema.String,
        EndpointID: Schema.String,
        Gateway: Schema.String,
        IPAddress: Schema.Union(Schema.Literal(""), MobySchemas.Address),
        IPPrefixLen: MobySchemas.Int64,
        IPv6Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: MobySchemas.Int64,
        DNSNames: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkEndpointSettings",
        title: "network.EndpointSettings",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/endpoint.go#L11-L40",
    }
) {}
