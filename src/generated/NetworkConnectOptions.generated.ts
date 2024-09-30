import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L58-L63",
    }
) {}
