import * as Schema from "@effect/schema/Schema";

export class NetworkIPAMConfig extends Schema.Class<NetworkIPAMConfig>("NetworkIPAMConfig")(
    {
        Subnet: Schema.optional(Schema.String),
        IPRange: Schema.optional(Schema.String),
        Gateway: Schema.optional(Schema.String),
        AuxiliaryAddresses: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "NetworkIPAMConfig",
        title: "network.IPAMConfig",
    }
) {}
