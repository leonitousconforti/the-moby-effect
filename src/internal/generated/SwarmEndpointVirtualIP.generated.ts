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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#EndpointVirtualIP",
    }
) {}
