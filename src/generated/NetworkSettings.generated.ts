import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";

export class NetworkSettings extends Schema.Class<NetworkSettings>("NetworkSettings")(
    {
        Bridge: Schema.String,
        SandboxID: Schema.String,
        SandboxKey: Schema.String,
        Ports: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemas.PortSchemas.PortBinding))),
            })
        ),
        HairpinMode: Schema.Boolean,
        LinkLocalIPv6Address: Schema.String,
        LinkLocalIPv6PrefixLen: MobySchemas.Int64,
        SecondaryIPAddresses: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemas.Address))),
        SecondaryIPv6Addresses: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemas.Address))),
        EndpointID: Schema.String,
        Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: MobySchemas.Int64,
        IPAddress: Schema.String,
        IPPrefixLen: MobySchemas.Int64,
        IPv6Gateway: Schema.String,
        MacAddress: Schema.String,
        Networks: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings) })
        ),
    },
    {
        identifier: "NetworkSettings",
        title: "types.NetworkSettings",
    }
) {}
