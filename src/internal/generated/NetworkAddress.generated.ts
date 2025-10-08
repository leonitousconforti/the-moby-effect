import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class NetworkAddress extends Schema.Class<NetworkAddress>("NetworkAddress")(
    {
        Addr: Schema.String,
        PrefixLen: EffectSchemas.Number.I64,
    },
    {
        identifier: "NetworkAddress",
        title: "network.Address",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#Address",
    }
) {}
