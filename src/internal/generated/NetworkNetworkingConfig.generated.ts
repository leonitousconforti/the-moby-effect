import * as Schema from "effect/Schema";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";

export class NetworkNetworkingConfig extends Schema.Class<NetworkNetworkingConfig>("NetworkNetworkingConfig")(
    {
        EndpointsConfig: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings) })
        ),
    },
    {
        identifier: "NetworkNetworkingConfig",
        title: "network.NetworkingConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L138-L142",
    }
) {}
