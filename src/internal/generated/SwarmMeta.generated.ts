import * as Schema from "effect/Schema";

import * as SwarmVersion from "./SwarmVersion.generated.ts";

export class SwarmMeta extends Schema.Class<SwarmMeta>("SwarmMeta")(
    {
        Version: Schema.optional(Schema.NullOr(SwarmVersion.SwarmVersion)),
        CreatedAt: Schema.optional(Schema.NullOr(Schema.DateFromString)),
        UpdatedAt: Schema.optional(Schema.NullOr(Schema.DateFromString)),
    },
    {
        identifier: "SwarmMeta",
        title: "swarm.Meta",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Meta",
    }
) {}
