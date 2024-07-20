import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SystemNetworkAddressPool extends Schema.Class<SystemNetworkAddressPool>("SystemNetworkAddressPool")(
    {
        Base: Schema.String,
        Size: MobySchemas.Int64,
    },
    {
        identifier: "SystemNetworkAddressPool",
        title: "system.NetworkAddressPool",
    }
) {}
