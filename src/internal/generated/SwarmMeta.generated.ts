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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/common.go#L18-L23",
    }
) {}
