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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#EngineDescription",
    }
) {}
