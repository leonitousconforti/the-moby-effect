import * as Schema from "effect/Schema";
import * as SwarmVersion from "./SwarmVersion.generated.js";

export class SwarmMeta extends Schema.Class<SwarmMeta>("SwarmMeta")(
    {
        Version: Schema.optionalWith(SwarmVersion.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        UpdatedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
    },
    {
        identifier: "SwarmMeta",
        title: "swarm.Meta",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Meta",
    }
) {}
