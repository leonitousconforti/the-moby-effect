import * as Schema from "effect/Schema";

export class SwarmPlatform extends Schema.Class<SwarmPlatform>("SwarmPlatform")(
    {
        Architecture: Schema.optional(Schema.String),
        OS: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPlatform",
        title: "swarm.Platform",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Platform",
    }
) {}
