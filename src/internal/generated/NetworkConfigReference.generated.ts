import * as Schema from "effect/Schema";

export class NetworkConfigReference extends Schema.Class<NetworkConfigReference>("NetworkConfigReference")(
    {
        Network: Schema.String,
    },
    {
        identifier: "NetworkConfigReference",
        title: "network.ConfigReference",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#ConfigReference",
    }
) {}
