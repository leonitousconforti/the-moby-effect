import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class EndpointSettings extends Schema.Class<EndpointSettings>("EndpointSettings")({
    IPAMConfig: MobySchemas.EndpointIPAMConfig,
    Links: Schema.Array(Schema.String),
    Aliases: Schema.Array(Schema.String),
    NetworkID: Schema.String,
    EndpointID: Schema.String,
    Gateway: Schema.String,
    IPAddress: Schema.String,
    IPPrefixLen: MobySchemas.Int64,
    IPv6Gateway: Schema.String,
    GlobalIPv6Address: Schema.String,
    GlobalIPv6PrefixLen: MobySchemas.Int64,
    MacAddress: Schema.String,
    DriverOpts: Schema.Record(Schema.String, Schema.String),
}) {}
