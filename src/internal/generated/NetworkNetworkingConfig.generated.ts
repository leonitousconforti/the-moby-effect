import * as Schema from "effect/Schema";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";

export class NetworkNetworkingConfig extends Schema.Class<NetworkNetworkingConfig>("NetworkNetworkingConfig")(
    {
        EndpointsConfig: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings) })
        )
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
    },
    {
        identifier: "NetworkNetworkingConfig",
        title: "network.NetworkingConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#NetworkingConfig",
    }
) {}
