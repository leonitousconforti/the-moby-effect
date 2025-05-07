import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class DefaultNetworkSettings extends Schema.Class<DefaultNetworkSettings>("DefaultNetworkSettings")(
    {
        EndpointID: Schema.String,
        Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: MobySchemas.Int64,
        IPAddress: Schema.String,
        IPPrefixLen: MobySchemas.Int64,
        IPv6Gateway: Schema.String,
        MacAddress: Schema.String,
    },
    {
        identifier: "DefaultNetworkSettings",
        title: "container.DefaultNetworkSettings",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/network_settings.go#L38-L50",
    }
) {}
