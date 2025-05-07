import * as Schema from "effect/Schema";
import * as NetworkIPAMConfig from "./NetworkIPAMConfig.generated.js";

export class NetworkIPAM extends Schema.Class<NetworkIPAM>("NetworkIPAM")(
    {
        Driver: Schema.String,
        Options: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Config: Schema.NullOr(Schema.Array(Schema.NullOr(NetworkIPAMConfig.NetworkIPAMConfig))),
    },
    {
        identifier: "NetworkIPAM",
        title: "network.IPAM",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/ipam.go#L11-L16",
    }
) {}
