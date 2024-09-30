import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmVersion extends Schema.Class<SwarmVersion>("SwarmVersion")(
    {
        Index: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "SwarmVersion",
        title: "swarm.Version",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/swarm/common.go#L8-L11",
    }
) {}
