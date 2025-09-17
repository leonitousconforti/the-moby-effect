import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmVersion extends Schema.Class<SwarmVersion>("SwarmVersion")(
    {
        Index: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "SwarmVersion",
        title: "swarm.Version",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Version",
    }
) {}
