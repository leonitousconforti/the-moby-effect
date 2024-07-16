import * as Schema from "@effect/schema/Schema";

export class SwarmPluginDescription extends Schema.Class<SwarmPluginDescription>("SwarmPluginDescription")(
    {
        Type: Schema.optional(Schema.String),
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPluginDescription",
        title: "swarm.PluginDescription",
    }
) {}
