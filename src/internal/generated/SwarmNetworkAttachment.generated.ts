import * as Schema from "effect/Schema";
import * as SwarmNetwork from "./SwarmNetwork.generated.js";

export class SwarmNetworkAttachment extends Schema.Class<SwarmNetworkAttachment>("SwarmNetworkAttachment")(
    {
        Network: Schema.optionalWith(SwarmNetwork.SwarmNetwork, { nullable: true }),
        Addresses: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmNetworkAttachment",
        title: "swarm.NetworkAttachment",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkAttachment",
    }
) {}
