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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#IPAMConfig",
    }
) {}
