import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkSettingsBase extends Schema.Class<NetworkSettingsBase>("NetworkSettingsBase")({
    Bridge: Schema.String,
    SandboxID: Schema.String,
    HairpinMode: Schema.Boolean,
    LinkLocalIPv6Address: Schema.String,
    LinkLocalIPv6PrefixLen: MobySchemas.Int64,
    Ports: Schema.Record(Schema.String, Schema.Array(MobySchemas.PortBinding)),
    SandboxKey: Schema.String,
    SecondaryIPAddresses: Schema.Array(MobySchemas.Address),
    SecondaryIPv6Addresses: Schema.Array(MobySchemas.Address),
}) {}
