import * as Schema from "effect/Schema";

export class ContainerDefaultNetworkSettings extends Schema.Class<ContainerDefaultNetworkSettings>("ContainerDefaultNetworkSettings")(
    {
        EndpointID: Schema.String,
        Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        IPAddress: Schema.String,
        IPPrefixLen: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        IPv6Gateway: Schema.String,
        MacAddress: Schema.String,
    },
    {
        identifier: "ContainerDefaultNetworkSettings",
        title: "container.DefaultNetworkSettings",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DefaultNetworkSettings",
    }
) {}
