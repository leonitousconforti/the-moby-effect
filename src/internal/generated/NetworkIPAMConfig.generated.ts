import * as Schema from "effect/Schema";

export class NetworkIPAMConfig extends Schema.Class<NetworkIPAMConfig>("NetworkIPAMConfig")(
    {
        Subnet: Schema.optional(Schema.String),
        IPRange: Schema.optional(Schema.String),
        Gateway: Schema.optional(Schema.String),
        AuxiliaryAddresses: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
    },
    {
        identifier: "NetworkIPAMConfig",
        title: "network.IPAMConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/ipam.go#L18-L24",
    }
) {}
