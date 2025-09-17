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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#IPAM",
    }
) {}
