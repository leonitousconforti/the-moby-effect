import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.ts";

export class NetworkNetworkingConfig extends Schema.Class<NetworkNetworkingConfig>("NetworkNetworkingConfig")(
    {
        EndpointsConfig: Schema.NullOr(
            Schema.Record(Schema.String, Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings))
        ).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
    },
    {
        identifier: "NetworkNetworkingConfig",
        title: "network.NetworkingConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#NetworkingConfig",
    }
) {}
