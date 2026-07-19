import * as Schema from "effect/Schema";

export class SystemNetworkAddressPool extends Schema.Class<SystemNetworkAddressPool>("SystemNetworkAddressPool")(
    {
        Base: Schema.String,
        Size: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "SystemNetworkAddressPool",
        title: "system.NetworkAddressPool",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#NetworkAddressPool",
    }
) {}
