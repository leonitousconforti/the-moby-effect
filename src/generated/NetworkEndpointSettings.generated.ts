import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as NetworkEndpointIPAMConfig from "./NetworkEndpointIPAMConfig.generated.js";

export class NetworkEndpointSettings extends Schema.Class<NetworkEndpointSettings>("NetworkEndpointSettings")(
    {
        IPAMConfig: Schema.NullOr(NetworkEndpointIPAMConfig.NetworkEndpointIPAMConfig),
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        Aliases: Schema.NullOr(Schema.Array(Schema.String)),
        MacAddress: MobySchemas.MacAddress,
        DriverOpts: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        NetworkID: Schema.String,
        EndpointID: Schema.String,
        Gateway: Schema.String,
        IPAddress: MobySchemas.Address,
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
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/network/endpoint.go#L11-L34",
    }
) {}
