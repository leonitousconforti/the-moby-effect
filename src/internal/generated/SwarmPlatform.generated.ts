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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L59-L63",
    }
) {}
