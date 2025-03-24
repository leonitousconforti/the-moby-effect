import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmSeccompOpts extends Schema.Class<SwarmSeccompOpts>("SwarmSeccompOpts")(
    {
        Mode: Schema.optional(Schema.String),
        Profile: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "SwarmSeccompOpts",
        title: "swarm.SeccompOpts",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/container.go#L44-L53",
    }
) {}
