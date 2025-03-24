import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmRestartPolicy extends Schema.Class<SwarmRestartPolicy>("SwarmRestartPolicy")(
    {
        Condition: Schema.optional(Schema.String),
        Delay: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        MaxAttempts: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        Window: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "SwarmRestartPolicy",
        title: "swarm.RestartPolicy",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L170-L176",
    }
) {}
