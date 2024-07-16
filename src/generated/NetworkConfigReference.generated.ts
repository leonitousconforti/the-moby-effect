import * as Schema from "@effect/schema/Schema";

export class NetworkConfigReference extends Schema.Class<NetworkConfigReference>("NetworkConfigReference")(
    {
        Network: Schema.String,
    },
    {
        identifier: "NetworkConfigReference",
        title: "network.ConfigReference",
    }
) {}
