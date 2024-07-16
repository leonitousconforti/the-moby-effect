import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkAddress extends Schema.Class<NetworkAddress>("NetworkAddress")(
    {
        Addr: Schema.String,
        PrefixLen: MobySchemas.Int64,
    },
    {
        identifier: "NetworkAddress",
        title: "network.Address",
    }
) {}
