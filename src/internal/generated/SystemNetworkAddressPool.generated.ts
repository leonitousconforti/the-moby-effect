import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SystemNetworkAddressPool extends Schema.Class<SystemNetworkAddressPool>("SystemNetworkAddressPool")(
    {
        Base: Schema.String,
        Size: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "SystemNetworkAddressPool",
        title: "system.NetworkAddressPool",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#NetworkAddressPool",
    }
) {}
