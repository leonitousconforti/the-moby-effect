import * as Schema from "@effect/schema/Schema";
import * as NetworkIPAMConfig from "./NetworkIPAMConfig.generated.js";

export class NetworkIPAM extends Schema.Class<NetworkIPAM>("NetworkIPAM")(
    {
        Driver: Schema.String,
        Options: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Config: Schema.NullOr(Schema.Array(Schema.NullOr(NetworkIPAMConfig.NetworkIPAMConfig))),
    },
    {
        identifier: "NetworkIPAM",
        title: "network.IPAM",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/ipam.go#L11-L16",
    }
) {}
