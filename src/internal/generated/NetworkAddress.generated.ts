import * as Schema from "effect/Schema";

export class NetworkAddress extends Schema.Class<NetworkAddress>("NetworkAddress")(
    {
        Addr: Schema.String,
        PrefixLen: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "NetworkAddress",
        title: "network.Address",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#Address",
    }
) {}
