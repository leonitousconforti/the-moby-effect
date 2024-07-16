import * as Schema from "@effect/schema/Schema";

export class SwarmDNSConfig extends Schema.Class<SwarmDNSConfig>("SwarmDNSConfig")(
    {
        Nameservers: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Search: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Options: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmDNSConfig",
        title: "swarm.DNSConfig",
    }
) {}
