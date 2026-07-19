import * as Schema from "effect/Schema";

export class SwarmDNSConfig extends Schema.Class<SwarmDNSConfig>("SwarmDNSConfig")(
    {
        Nameservers: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Search: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Options: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "SwarmDNSConfig",
        title: "swarm.DNSConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DNSConfig",
    }
) {}
