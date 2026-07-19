import * as Schema from "effect/Schema";
import * as SwarmPluginDescription from "./SwarmPluginDescription.generated.ts";

export class SwarmEngineDescription extends Schema.Class<SwarmEngineDescription>("SwarmEngineDescription")(
    {
        EngineVersion: Schema.optional(Schema.String),
        Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Plugins: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPluginDescription.SwarmPluginDescription)))),
    },
    {
        identifier: "SwarmEngineDescription",
        title: "swarm.EngineDescription",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#EngineDescription",
    }
) {}
