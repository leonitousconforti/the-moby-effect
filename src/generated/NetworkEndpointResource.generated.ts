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
    }
) {}
