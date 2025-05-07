import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L10-L22",
    }
) {}
