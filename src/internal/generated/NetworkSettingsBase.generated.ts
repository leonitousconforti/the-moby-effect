import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkSettingsBase extends Schema.Class<NetworkSettingsBase>("NetworkSettingsBase")(
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
    },
    {
        identifier: "NetworkSettingsBase",
        title: "types.NetworkSettingsBase",
    }
) {}
