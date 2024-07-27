import * as Schema from "@effect/schema/Schema";

export class NetworkEndpointResource extends Schema.Class<NetworkEndpointResource>("NetworkEndpointResource")(
    {
        Name: Schema.String,
        EndpointID: Schema.String,
        MacAddress: Schema.String,
        IPv4Address: Schema.String,
        IPv6Address: Schema.String,
    },
    {
        identifier: "NetworkEndpointResource",
        title: "network.EndpointResource",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L126-L134",
    }
) {}
