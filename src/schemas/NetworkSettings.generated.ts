import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkSettings extends Schema.Class<NetworkSettings>("NetworkSettings")({
    Bridge: Schema.String,
    SandboxID: Schema.String,
    HairpinMode: Schema.Boolean,
    LinkLocalIPv6Address: Schema.String,
    LinkLocalIPv6PrefixLen: MobySchemas.Int64,
    Ports: Schema.Record(Schema.String, Schema.Array(MobySchemas.PortBinding)),
    SandboxKey: Schema.String,
    SecondaryIPAddresses: Schema.Array(MobySchemas.Address),
    SecondaryIPv6Addresses: Schema.Array(MobySchemas.Address),
    EndpointID: Schema.String,
    Gateway: Schema.String,
    GlobalIPv6Address: Schema.String,
    GlobalIPv6PrefixLen: MobySchemas.Int64,
    IPAddress: Schema.String,
    IPPrefixLen: MobySchemas.Int64,
    IPv6Gateway: Schema.String,
    MacAddress: Schema.String,
    Networks: Schema.Record(Schema.String, MobySchemas.EndpointSettings),
}) {}
