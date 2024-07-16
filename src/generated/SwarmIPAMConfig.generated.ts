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
    }
) {}
