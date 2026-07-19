import * as Schema from "effect/Schema";

export class NetworkIPAMConfig extends Schema.Class<NetworkIPAMConfig>("NetworkIPAMConfig")(
    {
        Subnet: Schema.optional(Schema.String),
        IPRange: Schema.optional(Schema.String),
        Gateway: Schema.optional(Schema.String),
        AuxiliaryAddresses: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "NetworkIPAMConfig",
        title: "network.IPAMConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#IPAMConfig",
    }
) {}
