import * as Schema from "effect/Schema";

export class NetworkIPAMConfig extends Schema.Class<NetworkIPAMConfig>("NetworkIPAMConfig")(
    {
        Subnet: Schema.optional(Schema.String),
        IPRange: Schema.optional(Schema.String),
        Gateway: Schema.optional(Schema.String),
        AuxiliaryAddresses: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "NetworkIPAMConfig",
        title: "network.IPAMConfig",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/ipam.go#L18-L24",
    }
) {}
