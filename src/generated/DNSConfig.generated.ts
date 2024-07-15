import * as Schema from "@effect/schema/Schema";

export class DNSConfig extends Schema.Class<DNSConfig>("DNSConfig")(
    {
        Nameservers: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Search: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Options: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "DNSConfig",
        title: "swarm.DNSConfig",
    }
) {}
