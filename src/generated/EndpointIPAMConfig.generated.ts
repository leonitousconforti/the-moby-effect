import * as Schema from "@effect/schema/Schema";

export class EndpointIPAMConfig extends Schema.Class<EndpointIPAMConfig>("EndpointIPAMConfig")(
    {
        IPv4Address: Schema.optional(Schema.String, { nullable: true }),
        IPv6Address: Schema.optional(Schema.String, { nullable: true }),
        LinkLocalIPs: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "EndpointIPAMConfig",
        title: "network.EndpointIPAMConfig",
    }
) {}
