import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SystemNetworkAddressPool extends Schema.Class<SystemNetworkAddressPool>("SystemNetworkAddressPool")(
    {
        Base: Schema.String,
        Size: MobySchemas.Int64,
    },
    {
        identifier: "SystemNetworkAddressPool",
        title: "system.NetworkAddressPool",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#NetworkAddressPool",
    }
) {}
