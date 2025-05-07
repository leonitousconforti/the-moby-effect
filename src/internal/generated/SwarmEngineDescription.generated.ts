import * as Schema from "effect/Schema";
import * as SwarmPluginDescription from "./SwarmPluginDescription.generated.js";

export class SwarmEngineDescription extends Schema.Class<SwarmEngineDescription>("SwarmEngineDescription")(
    {
        EngineVersion: Schema.optional(Schema.String),
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Plugins: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPluginDescription.SwarmPluginDescription)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEngineDescription",
        title: "swarm.EngineDescription",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L65-L70",
    }
) {}
