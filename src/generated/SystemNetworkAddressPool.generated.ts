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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/info.go#L144-L148",
    }
) {}
