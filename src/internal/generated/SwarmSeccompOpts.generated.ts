import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmSeccompOpts extends Schema.Class<SwarmSeccompOpts>("SwarmSeccompOpts")(
    {
        Mode: Schema.optional(Schema.Literal("default", "unconfined", "custom")),
        Profile: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "SwarmSeccompOpts",
        title: "swarm.SeccompOpts",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SeccompOpts",
    }
) {}
