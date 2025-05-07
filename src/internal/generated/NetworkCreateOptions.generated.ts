import * as Schema from "effect/Schema";
import * as NetworkConfigReference from "./NetworkConfigReference.generated.js";
import * as NetworkIPAM from "./NetworkIPAM.generated.js";

export class NetworkCreateOptions extends Schema.Class<NetworkCreateOptions>("NetworkCreateOptions")(
    {
        Driver: Schema.String,
        Scope: Schema.String,
        EnableIPv4: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        EnableIPv6: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        IPAM: Schema.NullOr(NetworkIPAM.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigOnly: Schema.Boolean,
        ConfigFrom: Schema.NullOr(NetworkConfigReference.NetworkConfigReference),
        Options: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "NetworkCreateOptions",
        title: "network.CreateOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L32-L45",
    }
) {}
