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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L68-L73",
    }
) {}
