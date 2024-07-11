import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class DefaultNetworkSettings extends Schema.Class<DefaultNetworkSettings>("DefaultNetworkSettings")({
    EndpointID: Schema.String,
    Gateway: Schema.String,
    GlobalIPv6Address: Schema.String,
    GlobalIPv6PrefixLen: MobySchemas.Int64,
    IPAddress: Schema.String,
    IPPrefixLen: MobySchemas.Int64,
    IPv6Gateway: Schema.String,
    MacAddress: Schema.String,
}) {}
