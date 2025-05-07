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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L104-L108",
    }
) {}
