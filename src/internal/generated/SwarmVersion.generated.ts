import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmVersion extends Schema.Class<SwarmVersion>("SwarmVersion")(
    {
        Index: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "SwarmVersion",
        title: "swarm.Version",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/common.go#L8-L11",
    }
) {}
