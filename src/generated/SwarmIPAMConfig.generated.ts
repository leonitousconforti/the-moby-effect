import * as Schema from "@effect/schema/Schema";

export class SwarmIPAMConfig extends Schema.Class<SwarmIPAMConfig>("SwarmIPAMConfig")(
    {
        Subnet: Schema.optional(Schema.String),
        Range: Schema.optional(Schema.String),
        Gateway: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmIPAMConfig",
        title: "swarm.IPAMConfig",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L116-L121",
    }
) {}
