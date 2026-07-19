import * as Schema from "effect/Schema";
import * as NetworkEndpointIPAMConfig from "./NetworkEndpointIPAMConfig.generated.ts";

export class NetworkEndpointSettings extends Schema.Class<NetworkEndpointSettings>("NetworkEndpointSettings")(
    {
        IPAMConfig: Schema.NullOr(NetworkEndpointIPAMConfig.NetworkEndpointIPAMConfig),
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        Aliases: Schema.NullOr(Schema.Array(Schema.String)),
        MacAddress: Schema.String,
        DriverOpts: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        GwPriority: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        NetworkID: Schema.String,
        EndpointID: Schema.String,
        Gateway: Schema.String,
        IPAddress: Schema.String,
        IPPrefixLen: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        IPv6Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        DNSNames: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkEndpointSettings",
        title: "network.EndpointSettings",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#EndpointSettings",
    }
) {}
