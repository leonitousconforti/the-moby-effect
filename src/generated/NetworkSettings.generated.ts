import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSettings extends Schema.Class<NetworkSettings>("NetworkSettings")(
    {
        Bridge: Schema.String,
        SandboxID: Schema.String,
        HairpinMode: Schema.Boolean,
        LinkLocalIPv6Address: Schema.String,
        LinkLocalIPv6PrefixLen: MobySchemas.Int64,
        Ports: Schema.NullOr(Schema.Record(Schema.String, Schema.Array(MobySchemasGenerated.PortBinding))),
        SandboxKey: Schema.String,
        SecondaryIPAddresses: Schema.NullOr(Schema.Array(MobySchemasGenerated.NetworkAddress)),
        SecondaryIPv6Addresses: Schema.NullOr(Schema.Array(MobySchemasGenerated.NetworkAddress)),
        EndpointID: Schema.String,
        Gateway: Schema.String,
        GlobalIPv6Address: Schema.String,
        GlobalIPv6PrefixLen: MobySchemas.Int64,
        IPAddress: Schema.String,
        IPPrefixLen: MobySchemas.Int64,
        IPv6Gateway: Schema.String,
        MacAddress: Schema.String,
        Networks: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.NetworkEndpointSettings)),
    },
    {
        identifier: "NetworkSettings",
        title: "types.NetworkSettings",
    }
) {}
