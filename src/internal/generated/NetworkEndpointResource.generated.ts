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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#EndpointResource",
    }
) {}
