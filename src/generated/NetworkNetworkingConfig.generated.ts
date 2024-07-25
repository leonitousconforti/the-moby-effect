import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkNetworkingConfig extends Schema.Class<NetworkNetworkingConfig>("NetworkNetworkingConfig")(
    {
        EndpointsConfig: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.NullOr(MobySchemasGenerated.NetworkEndpointSettings),
            })
        ),
    },
    {
        identifier: "NetworkNetworkingConfig",
        title: "network.NetworkingConfig",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/network/network.go#L136-L140",
    }
) {}
