import * as Schema from "effect/Schema";

export class SwarmPlatform extends Schema.Class<SwarmPlatform>("SwarmPlatform")(
    {
        Architecture: Schema.optional(Schema.String),
        OS: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPlatform",
        title: "swarm.Platform",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L59-L63",
    }
) {}
