import * as Schema from "@effect/schema/Schema";

export class SwarmPlatform extends Schema.Class<SwarmPlatform>("SwarmPlatform")(
    {
        Architecture: Schema.optional(Schema.String),
        OS: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPlatform",
        title: "swarm.Platform",
    }
) {}
