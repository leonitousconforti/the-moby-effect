import * as Schema from "@effect/schema/Schema";

export class EndpointVirtualIP extends Schema.Class<EndpointVirtualIP>("EndpointVirtualIP")(
    {
        NetworkID: Schema.optional(Schema.String, { nullable: true }),
        Addr: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "EndpointVirtualIP",
        title: "swarm.EndpointVirtualIP",
    }
) {}
