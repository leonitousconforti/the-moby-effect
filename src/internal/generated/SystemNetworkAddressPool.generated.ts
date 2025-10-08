import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SystemNetworkAddressPool extends Schema.Class<SystemNetworkAddressPool>("SystemNetworkAddressPool")(
    {
        Base: Schema.String,
        Size: EffectSchemas.Number.I64,
    },
    {
        identifier: "SystemNetworkAddressPool",
        title: "system.NetworkAddressPool",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#NetworkAddressPool",
    }
) {}
