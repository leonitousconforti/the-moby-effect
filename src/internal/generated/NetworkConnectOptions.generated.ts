import * as Schema from "effect/Schema";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";

export class NetworkConnectOptions extends Schema.Class<NetworkConnectOptions>("NetworkConnectOptions")(
    {
        Container: Schema.String,
        EndpointConfig: Schema.optionalWith(NetworkEndpointSettings.NetworkEndpointSettings, { nullable: true }),
    },
    {
        identifier: "NetworkConnectOptions",
        title: "network.ConnectOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L59-L64",
    }
) {}
