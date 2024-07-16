import * as Schema from "@effect/schema/Schema";

export class SwarmEndpointVirtualIP extends Schema.Class<SwarmEndpointVirtualIP>("SwarmEndpointVirtualIP")(
    {
        NetworkID: Schema.optional(Schema.String),
        Addr: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmEndpointVirtualIP",
        title: "swarm.EndpointVirtualIP",
    }
) {}
