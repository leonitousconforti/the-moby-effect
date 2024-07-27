import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L104-L108",
    }
) {}
