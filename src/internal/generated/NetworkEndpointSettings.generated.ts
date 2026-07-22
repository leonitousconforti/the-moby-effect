import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as NetworkEndpointIPAMConfig from "./NetworkEndpointIPAMConfig.generated.ts";

export class NetworkEndpointSettings extends Schema.Class<NetworkEndpointSettings>("NetworkEndpointSettings")(
    {
        IPAMConfig: Schema.NullOr(NetworkEndpointIPAMConfig.NetworkEndpointIPAMConfig),
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        Aliases: Schema.NullOr(Schema.Array(Schema.String)),
        MacAddress: Schema.String,
        DriverOpts: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        // optional for docker.io/library/docker:26-dind-rootless and 27 (added in docker v28)
        GwPriority: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        NetworkID: Schema.String,
        EndpointID: Schema.String,
        Gateway: Schema.String,
        IPAddress: Schema.String,
        IPPrefixLen: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        IPv6Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        DNSNames: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkEndpointSettings",
        title: "network.EndpointSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#EndpointSettings",
    }
) {}
