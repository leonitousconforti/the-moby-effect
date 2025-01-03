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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/common.go#L18-L23",
    }
) {}
