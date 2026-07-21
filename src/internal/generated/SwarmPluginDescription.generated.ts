import * as Schema from "effect/Schema";

export class SwarmPluginDescription extends Schema.Class<SwarmPluginDescription>("SwarmPluginDescription")(
    {
        Type: Schema.optional(Schema.String),
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPluginDescription",
        title: "swarm.PluginDescription",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PluginDescription",
    }
) {}
