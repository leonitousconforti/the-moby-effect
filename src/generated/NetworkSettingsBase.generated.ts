import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSettingsBase extends Schema.Class<NetworkSettingsBase>("NetworkSettingsBase")(
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
    },
    {
        identifier: "NetworkSettingsBase",
        title: "types.NetworkSettingsBase",
    }
) {}
