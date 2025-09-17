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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DNSConfig",
    }
) {}
