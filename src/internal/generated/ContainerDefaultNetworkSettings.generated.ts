import * as Schema from "effect/Schema";

export class ContainerDefaultNetworkSettings extends Schema.Class<ContainerDefaultNetworkSettings>(
    "ContainerDefaultNetworkSettings"
)(
    {
        EndpointID: Schema.optional(Schema.String),
        Gateway: Schema.optional(Schema.String),
        GlobalIPv6Address: Schema.optional(Schema.String),
        GlobalIPv6PrefixLen: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        IPAddress: Schema.optional(Schema.String),
        IPPrefixLen: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        IPv6Gateway: Schema.optional(Schema.String),
        MacAddress: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerDefaultNetworkSettings",
        title: "container.DefaultNetworkSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DefaultNetworkSettings",
    }
) {}
