import * as Schema from "@effect/schema/Schema";

export class NetworkConfigReference extends Schema.Class<NetworkConfigReference>("NetworkConfigReference")(
    {
        Network: Schema.String,
    },
    {
        identifier: "NetworkConfigReference",
        title: "network.ConfigReference",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L142-L145",
    }
) {}
