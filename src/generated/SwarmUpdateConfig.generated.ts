import * as Schema from "@effect/schema/Schema";
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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L126-L163",
    }
) {}
