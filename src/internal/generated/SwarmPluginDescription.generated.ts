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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L87-L91",
    }
) {}
