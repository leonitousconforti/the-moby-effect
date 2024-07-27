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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/container.go#L10-L22",
    }
) {}
