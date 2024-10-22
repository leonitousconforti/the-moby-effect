import * as Schema from "effect/Schema";
import * as SwarmPluginDescription from "./SwarmPluginDescription.generated.js";

export class SwarmEngineDescription extends Schema.Class<SwarmEngineDescription>("SwarmEngineDescription")(
    {
        EngineVersion: Schema.optional(Schema.String),
        Labels: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        Plugins: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPluginDescription.SwarmPluginDescription)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEngineDescription",
        title: "swarm.EngineDescription",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L65-L70",
    }
) {}
