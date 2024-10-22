import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmPortConfig extends Schema.Class<SwarmPortConfig>("SwarmPortConfig")(
    {
        // FIXME: use better types
        Name: Schema.optional(Schema.String),
        Protocol: Schema.optional(Schema.String),
        TargetPort: Schema.optional(MobySchemas.UInt32),
        PublishedPort: Schema.optional(MobySchemas.UInt32),
        PublishMode: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPortConfig",
        title: "swarm.PortConfig",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L30-L40",
    }
) {}
