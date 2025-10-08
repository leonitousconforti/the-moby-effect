import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmVersion extends Schema.Class<SwarmVersion>("SwarmVersion")(
    {
        Index: Schema.optional(EffectSchemas.Number.U64),
    },
    {
        identifier: "SwarmVersion",
        title: "swarm.Version",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Version",
    }
) {}
