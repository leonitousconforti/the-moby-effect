import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkAddress extends Schema.Class<NetworkAddress>("NetworkAddress")(
    {
        Addr: Schema.String,
        PrefixLen: MobySchemas.Int64,
    },
    {
        identifier: "NetworkAddress",
        title: "network.Address",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#Address",
    }
) {}
