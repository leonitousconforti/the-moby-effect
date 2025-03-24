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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L87-L91",
    }
) {}
