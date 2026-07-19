import * as Schema from "effect/Schema";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.ts";

export class NetworkConnectOptions extends Schema.Class<NetworkConnectOptions>("NetworkConnectOptions")(
    {
        Container: Schema.String,
        EndpointConfig: Schema.optional(Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings)),
    },
    {
        identifier: "NetworkConnectOptions",
        title: "network.ConnectOptions",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#ConnectOptions",
    }
) {}
