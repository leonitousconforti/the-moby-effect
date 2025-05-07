import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L116-L121",
    }
) {}
