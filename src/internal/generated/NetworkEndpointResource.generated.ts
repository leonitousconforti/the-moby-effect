import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L128-L136",
    }
) {}
