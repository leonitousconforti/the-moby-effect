import * as Schema from "effect/Schema";

import * as SwarmNetwork from "./SwarmNetwork.generated.ts";

export class SwarmNetworkAttachment extends Schema.Class<SwarmNetworkAttachment>("SwarmNetworkAttachment")(
    {
        Network: Schema.optional(Schema.NullOr(SwarmNetwork.SwarmNetwork)),
        Addresses: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "SwarmNetworkAttachment",
        title: "swarm.NetworkAttachment",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkAttachment",
    }
) {}
