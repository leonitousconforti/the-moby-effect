import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmVersion extends Schema.Class<SwarmVersion>("SwarmVersion")(
    {
        Index: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "SwarmVersion",
        title: "swarm.Version",
    }
) {}
