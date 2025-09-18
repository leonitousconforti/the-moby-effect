import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmRestartPolicy extends Schema.Class<SwarmRestartPolicy>("SwarmRestartPolicy")(
    {
        Condition: Schema.optional(Schema.Literal("none", "on-failure", "any")),
        Delay: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        MaxAttempts: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        Window: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "SwarmRestartPolicy",
        title: "swarm.RestartPolicy",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#RestartPolicy",
    }
) {}
