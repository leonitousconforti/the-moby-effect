import * as Schema from "effect/Schema";

export class SwarmEndpointVirtualIP extends Schema.Class<SwarmEndpointVirtualIP>("SwarmEndpointVirtualIP")(
    {
        NetworkID: Schema.optional(Schema.String),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmEndpointVirtualIP",
        title: "swarm.EndpointVirtualIP",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L68-L73",
    }
) {}
