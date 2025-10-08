import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as NetworkEndpointIPAMConfig from "./NetworkEndpointIPAMConfig.generated.js";

export class NetworkEndpointSettings extends Schema.Class<NetworkEndpointSettings>("NetworkEndpointSettings")(
    {
        IPAMConfig: Schema.NullOr(NetworkEndpointIPAMConfig.NetworkEndpointIPAMConfig),
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        Aliases: Schema.NullOr(Schema.Array(Schema.String)),
        MacAddress: Schema.String,
        DriverOpts: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        GwPriority: EffectSchemas.Number.I64,
        NetworkID: Schema.String,
        EndpointID: Schema.String,
        Gateway: Schema.String,
        IPAddress: Schema.String,
        IPPrefixLen: EffectSchemas.Number.I64,
        IPv6Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: EffectSchemas.Number.I64,
        DNSNames: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkEndpointSettings",
        title: "network.EndpointSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#EndpointSettings",
    }
) {}
