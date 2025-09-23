import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerDefaultNetworkSettings extends Schema.Class<ContainerDefaultNetworkSettings>(
    "ContainerDefaultNetworkSettings"
)(
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
        identifier: "ContainerDefaultNetworkSettings",
        title: "container.DefaultNetworkSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DefaultNetworkSettings",
    }
) {}
