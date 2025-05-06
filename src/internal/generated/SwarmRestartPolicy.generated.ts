import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmRestartPolicy extends Schema.Class<SwarmRestartPolicy>("SwarmRestartPolicy")(
    {
        Condition: Schema.optional(
            Schema.Literal("none", "on-failure", "any").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L178-L188",
            })
        ),
        Delay: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        MaxAttempts: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        Window: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "SwarmRestartPolicy",
        title: "swarm.RestartPolicy",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L170-L176",
    }
) {}
