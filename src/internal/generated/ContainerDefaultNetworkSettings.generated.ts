import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerDefaultNetworkSettings extends Schema.Class<ContainerDefaultNetworkSettings>(
    "ContainerDefaultNetworkSettings"
)(
    {
        EndpointID: Schema.String,
        Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: EffectSchemas.Number.I64,
        IPAddress: Schema.String,
        IPPrefixLen: EffectSchemas.Number.I64,
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
