import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSettingsBase extends Schema.Class<NetworkSettingsBase>("NetworkSettingsBase")(
    {
        Bridge: Schema.NullOr(Schema.String),
        SandboxID: Schema.NullOr(Schema.String),
        HairpinMode: Schema.NullOr(Schema.Boolean),
        LinkLocalIPv6Address: Schema.NullOr(Schema.String),
        LinkLocalIPv6PrefixLen: Schema.NullOr(MobySchemas.Int64),
        Ports: Schema.NullOr(Schema.Record(Schema.String, Schema.Array(MobySchemasGenerated.PortBinding))),
        SandboxKey: Schema.NullOr(Schema.String),
        SecondaryIPAddresses: Schema.NullOr(Schema.Array(MobySchemasGenerated.Address)),
        SecondaryIPv6Addresses: Schema.NullOr(Schema.Array(MobySchemasGenerated.Address)),
    },
    {
        identifier: "NetworkSettingsBase",
        title: "types.NetworkSettingsBase",
    }
) {}
