import * as Schema from "@effect/schema/Schema";

export class SwarmDNSConfig extends Schema.Class<SwarmDNSConfig>("SwarmDNSConfig")(
    {
        Nameservers: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Search: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Options: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmDNSConfig",
        title: "swarm.DNSConfig",
    }
) {}
