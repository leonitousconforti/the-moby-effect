import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmUpdateConfig extends Schema.Class<SwarmUpdateConfig>("SwarmUpdateConfig")(
    {
        Parallelism: MobySchemas.UInt64,
        Delay: Schema.optional(MobySchemas.Int64),
        FailureAction: Schema.optional(Schema.String),
        Monitor: Schema.optional(MobySchemas.Int64),
        MaxFailureRatio: Schema.Number,
        Order: Schema.String,
    },
    {
        identifier: "SwarmUpdateConfig",
        title: "swarm.UpdateConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#UpdateConfig",
    }
) {}
