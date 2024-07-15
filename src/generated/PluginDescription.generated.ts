import * as Schema from "@effect/schema/Schema";

export class PluginDescription extends Schema.Class<PluginDescription>("PluginDescription")(
    {
        Type: Schema.optional(Schema.String, { nullable: true }),
        Name: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "PluginDescription",
        title: "swarm.PluginDescription",
    }
) {}
